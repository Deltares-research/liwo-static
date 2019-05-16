import Vue from 'vue'
import Vuex from 'vuex'

// TODO: why the fp?
import fp from 'lodash/fp'
import _ from 'lodash'

import loadBreach from './lib/load-breach'
import { loadLayerSetById, extractUnit } from './lib/load-layersets'
import loadCombinedScenario from './lib/load-combined-scenario'
import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from './lib/layer-parser'
import buildLayerSetNotifications from './lib/build-layerset-notifications'
import mapConfig from './map.config'
import { wrapInProperty, apply } from './lib/utils'

Vue.use(Vuex)

const LAYERPANEL_VIEW_MAPLAYERS = 'maplayers_view'
const LAYERPANEL_VIEW_BREACHES = 'breaches_view'

export default new Vuex.Store({
  state: {

    // we have three or four levels that can be current/active/selected
    // layerSet -> layers -> variants (-> features|bands)
    // active/current -> currently loaded TODO: use consistent
    // selected -> selected by user

    // current/active/selected layer,
    // changing these triggers a load of the corresponding data
    // TODO: check what this is..., it's a layerSetId...
    layerSetId: 0,
    selectedLayerId: 0,

    // Band  is used to select the band in a WMS layer with multiple bands
    currentBand: undefined,
    // TODO: rename to features, the context of the selectedLayer  makes it clear if they are breaches or something else
    selectedBreaches: [],

    // We keep track of some state across pages.
    // all layer data (stored so it doesn't need to fetch on changing pages)

    // TODO, consider storing layers by id separate, then  we don't need breach layers
    layerSetsById: {},
    // all notifications, by LayerSetId
    notificationsById: {},

    // Everything below here should be cleaned up.

    // Some state information that is related to the current route...
    // TODO: move to router
    // just use document.title = to.meta.title in beforeEach route
    pageTitle: undefined,
    // alow to select multiple breaches
    // TODO: move to route property
    selectBreachMultiple: false,

    // TODO: move to combined component
    // if it's by id, why is it a list?
    breachLayersById: [],
    breachProbabilityFilterIndex: 0,

    // A whole set of state variables related to what's visible
    // TODO: store visible state in layers
    visibleBreachLayers: {},
    hiddenLayers: [],
    // change layer visibility in the layers
    visibleLayerIds: [],
    visibleVariantIndexByLayerId: {},
    // keep layer state in layers
    opacityByLayerId: {},

    // A state variable that should be in the layer
    // TODO: store layer state in layer
    layerUnits: {},

    // A set of id's that I don't recognize
    // TODO: what is a maplayer???
    selectedMapLayerId: 0,
    // TODO: what's the difference between selectedLayerSetIndex
    selectedLayerSetIndex: 0,
    // TODO: what is this?
    combinedScenario: undefined
  },
  mutations: {
    addBreachLayer (state, { id, breachLayers, breachName, iscontrollayer }) {
      state.breachLayersById = {
        ...state.breachLayersById,
        [ id ]: { layers: breachLayers, layerSetTitle: breachName, id, iscontrollayer }
      }
    },
    setLayerSetById (state, { id, layerSet }) {
      state.layerSetsById = {
        ...state.layerSetsById,
        [ id ]: layerSet
      }
    },
    setLayerSetId (state, id) {
      state.layerSetId = id
    },
    toggleSelectedBreach (state, id) {
      const breachLayerIds = state.breachLayersById[id].layers.map(layer => layer.id)

      // it was already selected
      if (fp.includes(state.selectedBreaches, id)) {
        state.selectedBreaches = fp.filter(state.selectedBreaches, ['id', id])
      } else {
        // otherwise add it
        if (state.selectBreachMultiple) {
          state.selectedBreaches.push(id)
        } else {
          // or set it
          state.selectedBreaches = [id]
        }
      }
      // set associated variables
      if (state.selectBreachMultiple) {
        state.visibleLayerIds = state.visibleLayerIds.concat(breachLayerIds[0])
        state.visibleVariantIndexByLayerId = { ...state.visibleVariantIndexByLayerId, [ breachLayerIds[0] ]: 0 }
        state.opacityByLayerId = { ...state.opacityByLayerId, [ state.opacityByLayerId[id] ]: 1 }
        // TODO: get rid of this
        // state.activeLayerSetId = id
        state.selectedLayerId = breachLayerIds[0]
      } else {
        state.visibleLayerIds = state.visibleLayerIds.filter(layerId => breachLayerIds.indexOf(layerId) === -1)
        state.visibleVariantIndexByLayerId = { ...state.visibleVariantIndexByLayerId, ...breachLayerIds.reduce((visibleVariants, id) => ({ ...visibleVariants, [ id ]: 0 }), {}) }
        // TODO fix  this
        // state.activeLayerSetId = state.selectedBreaches[0]
      }
    },
    resetSelectedBreaches (state) {
      state.selectedBreaches = []
    },
    resetBreachLayersById (state) {
      state.breachLayersById = []
    },
    setPageTitle (state, title) {
      state.pageTitle = title
    },
    setSelectedLayerId (state, id) {
      state.selectedLayerId = id
    },
    setVisibleVariantIndexForLayerId (state, { index, layerId }) {
      state.visibleVariantIndexByLayerId = {
        ...state.visibleVariantIndexByLayerId,
        [layerId]: index
      }
    },
    setOpacityByLayerId (state, {opacity, layerId}) {
      state.opacityByLayerId = {
        ...state.opacityByLayerId,
        [layerId]: opacity
      }
    },
    setVisibleBreachLayers (state, { breach, layers }) {
      state.visibleBreachLayers = {
        ...state.visibleBreachLayers,
        [ breach ]: layers
      }
    },
    resetVisibleLayers (state) {
      state.visibleLayerIds = []
    },
    initToMapLayers (state, layerSetId) {
      const currentLayerSet = state.layerSetsById[layerSetId]
      // Why?
      state.visibleLayerIds = currentLayerSet
        .filter(layer => layer.properties.visible)
        .map(layer => layer.id)
      state.selectedBreaches = []
      state.opacityByLayerId = {}
      state.selectedLayerId = state.visibleLayerIds[0]
      state.visibleVariantIndexByLayerId = currentLayerSet
        .reduce((visibleVariants, { id }) => ({ ...visibleVariants, [ id ]: 0 }), {})
    },
    resetToMapLayers (state) {
      const selectedBreaches = state.selectedBreaches
      state.visibleLayerIds = state.visibleLayerIds.filter((layerId) => selectedBreaches.indexOf(layerId) === -1)
      state.selectedBreaches = []
      state.opacityByLayerId = {}
      state.selectedLayerId = state.visibleLayerIds[0]
    },
    hideLayerById (state, id) {
      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => layerId !== id)
      state.opacityByLayerId = { ...state.opacityByLayerId, [ id ]: 1 }
    },
    hideLayersById (state, layerIds) {
      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => layerIds.some(layerId))
      state.opacityByLayerId = {
        ...state.opacityByLayerId,
        ...layerIds.reduce((opacities, id) => ({ ...opacities, [ id ]: 1 }), {})
      }
    },
    showLayerById (state, id) {
      state.visibleLayerIds = state.visibleLayerIds.concat(id)
    },
    toggleLayerById (state, id) {
      if (state.visibleLayerIds.some(visibleId => id === visibleId)) {
        this.commit('hideLayerById', id)
      } else {
        this.commit('showLayerById', id)
      }
    },
    setProbabilityFilterIndex (state, index) {
      state.breachProbabilityFilterIndex = index
      // TODO: apply filter to layer
      this.commit('resetToMapLayers')
    },
    setNotificationsById (state, {id, notifications}) {
      state.notificationsById[id] = notifications
    },
    addNotificationById (state, {id, notification}) {
      const notifications = state.notificationsById[id] || []
      notifications.push(notification)
      state.notifications = notifications
    },
    setLayerUnits (state, layerUnits) {
      state.layerUnits = {...state.layerUnits, ...layerUnits}
    },
    setViewerType (state, type) {
      state.viewerType = type
    },
    setCombinedScenario (state, options) {
      state.combinedScenario = options
    },
    clearCombinedScenario (state, url) {
      state.combinedScenario = undefined
    },
    toggleActiveMarker (state, id) {
      if (state.hiddenLayers.includes(id)) {
        state.hiddenLayers = state.hiddenLayers.filter(markerId => markerId !== id)
      } else {
        state.hiddenLayers = [...state.hiddenLayers, id]
      }
    },
    setCurrentBand (state, band) {
      state.currentBand = band
    }
  },
  actions: {
    async loadLayerSetById (state, { id, initializeMap, filterByIds, selectMultipleFeatures }) {
      // TODO what is this...
      if (state.layerSetsById && state.layerSetsById[id]) {
        return
      }
      // Load a layerSet
      // Make  sure you don't add any interaction here  yet.
      // This should just load and clean up, no filtering, no dependency on any view state

      // load the raw layerSet
      const layerSetRaw = await loadLayerSetById(id)
      // the data we get from the api is a bit unorganized so normalize it
      // Actually I think we're  unnormalizing....
      // deep clone so we can always compare
      const layerSetNormalized = normalizeLayerSet(_.cloneDeep(layerSetRaw))
      // There might be some issues that we need to  fix...
      const layerSet = cleanLayerSet(layerSetNormalized)

      // The layers are in a deep  structure. Flatten it before  building the notifications
      const layers = flattenLayerSet(layerSet)

      const notifications = buildLayerSetNotifications(layers)

      // TODO move this to cleanLayerSet
      const layerUnits = layerSet.layers.reduce((acc, layer) => {
        acc[layer.legend.layer] = extractUnit(layer.legend.title)
        return acc
      }, {})

      // TODO: the function is called setLayerSet[s]
      // but it only loads  the layers of 1 layerSet, make this consistent

      state.commit('setLayerSetById', { id, layerSet: layerSet.layers })
      state.commit('setPageTitle', layerSet.title)
      // TODO: get rid of this
      state.commit('setLayerUnits', layerUnits)
      // TODO: why not in the view...
      state.commit('setNotificationsById', {id, notifications})

      // TODO: why? What does initTo mean?
      if (initializeMap) {
        state.commit('initToMapLayers', id)
      }
    },
    async addBreach ({ commit, state }, { id, breachName, variantId, layerType, isControllable }) {
      if (Object.keys(state.breachLayersById).indexOf(String(id)) === -1) {
        const breach = await loadBreach(id, layerType, state.viewerType)
        // TODO why is this different from loadLayerSetsById???
        const breachLayers = normalizeLayerSet(breach.layers)

        const layerUnits = breachLayers.reduce((acc, layer) => {
          acc[layer.legend.layer] = extractUnit(layer.legend.title)
          return acc
        }, [])

        const visibleBreachLayers = breachLayers.map((layer) => layer.id)

        commit('addBreachLayer', { id, breachLayers, breachName, iscontrollayer: isControllable })
        commit('setVisibleBreachLayers', { breach: id, layers: visibleBreachLayers })
        commit('setLayerUnits', layerUnits)
        commit('toggleSelectedBreach', id)

        const activeLayer = breach.layers.find(layer =>
          layer.variants.find(variant => {
            return variantId === variant.map.map_id
          })
        )

        if (activeLayer) {
          const activeVariant = activeLayer.variants.find(variant => {
            return variantId === variant.map.map_id
          })

          const index = activeLayer.variants.indexOf(activeVariant)

          commit('setVisibleVariantIndexForLayerId', { layerId: activeLayer.legend.layer, index })
        }
      } else {
        commit('toggleSelectedBreach', id)
      }
    },
    async loadCombinedScenario ({commit, state}, { layerIds, band }) {
      // TODO: check  if layerId is  a layerId or a  variantId
      const combinedScenario = await loadCombinedScenario({ layerIds, band })
      commit('setCombinedScenario', combinedScenario)
      commit('setVisibleVariantIndexForLayerId', { index: 0, layerId: 'combined_scenario' })
      commit('showLayerById', 'combined_scenario')
    },
    async setActiveLayersFromVariantIds ({ commit, dispatch, getters, state }, ids) {
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

      await Promise.all(ids
        .map(mapid => {
          return fetch(`${mapConfig.services.WEBSERVICE_URL}/Maps.asmx/GetBreachLocationId`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ mapid })
          })
            .then(res => res.json())
            .then(data => JSON.parse(data.d))
            .then(data => ({ ...data, variantId: mapid }))
        }))
        .then((locations) => {
          locations
            .filter(location => !state.selectedBreaches.includes(location.breachlocationid))
            .forEach(({ breachlocationtype, breachlocationid, breachlocationname, variantId }) => {
              let layerType

              switch (breachlocationtype) {
                case 'PRIM':
                  layerType = 'geo_doorbraaklocaties_primair'
                  break
                case 'REG':
                  layerType = 'geo_doorbraaklocaties_regionaal'
                  break
              }

              dispatch('addBreach', {
                id: breachlocationid,
                layerType,
                breachName: breachlocationname,
                isControllable: state.viewerType !== 'combined'
              })
            })
        })
    }
  },
  getters: {
    combinedScenarioAsLayer ({ combinedScenario, viewerType, currentBand, breachLayersById }) {
      // TODO: move to combine view
      let band
      let metadata = {}

      switch (currentBand) {
        case 'waterdepth':
          band = 'Waterdiepte'
          break
        case 'velocity':
          band = 'Stroomsnelheid'
          break
        case 'riserate':
          band = 'Stijgsnelheid'
          break
        case 'damage':
          band = 'Schade'
          break
        case 'casualties':
          band = 'Slachtoffers'
          break
      }
      if (combinedScenario) {
        // TODO check what id this is
        const layerByMapId = mapId =>
          fp.pipe([
            fp.get('variants'),
            fp.find(['map_id', mapId])
          ])

        const getVariantById = liwoId =>
          fp.pipe([
            fp.get('layers'),
            fp.flatMap(fp.get('variants')),
            fp.find(['map_id', liwoId]),
            wrapInProperty('variant')
          ])

        const getLayerByVariantId = liwoId =>
          fp.pipe([
            fp.get('layers'),
            fp.find(layerByMapId(liwoId)),
            fp.get('properties.name'),
            wrapInProperty('layerName')
          ])

        const getLayerSetTitle =
          fp.pipe([
            fp.get('layerSetTitle'),
            wrapInProperty('layerSetTitle')
          ])

        const getMetaDataForLiwoID = liwoId =>
          fp.pipe([
            fp.map(
              fp.pipe([
                apply([
                  getLayerSetTitle,
                  getLayerByVariantId(liwoId),
                  getVariantById(liwoId)
                ]),
                fp.reduce(fp.merge, {})
              ])
            ),
            fp.find('variant')
          ])

        const mapLiwoIdToBreachLayer = liwoId =>
          fp.pipe([
            fp.values,
            getMetaDataForLiwoID(liwoId)
          ])(breachLayersById)

        metadata = combinedScenario.liwo_ids
          .map(mapLiwoIdToBreachLayer)
          .map(({ layerName, layerSetTitle, variant }) => ({
            [layerSetTitle]: `
              <p>Band: ${layerName}</p>
              <p>${fp.get('title', variant)}</p>
              <p>${fp.get('metadata.title', variant)}</p>
            `
          }))
          .reduce(fp.merge, {})
      }
      const layer = {
        id: 'combined_scenario',
        properties: { title: 'Gecombineerd Scenario' },
        legend: {
          layer: 'geo_maximale_waterdiepte_2015_nederland',
          title: 'Gecombineerd Scenario [-]',
          geojson_style: '',
          namespace: 'LIWO_MEGO',
          style: `LIWO_Basis_${band}`
        },
        variants: [{
          layer: 'combined_scenario',
          metadata: {
            title: 'Gecombineerd Scenario',
            ...metadata
          },
          ...combinedScenario
        }]
      }

      return layer
    },
    mapLayers ({ layerSetsById, layerSetId }, { combinedScenarioAsLayer }) {
      if (!layerSetId || !layerSetsById) {
        return []
      }

      const layers = fp.cloneDeep(layerSetsById[layerSetId] || [])
      if (combinedScenarioAsLayer) layers.push(combinedScenarioAsLayer)

      return [{ layers }]
    },
    breachLayers ({ breachLayersById, selectedBreaches }) {
      return selectedBreaches.map(breachId => breachLayersById[breachId])
    },
    currentBreachesLayerSet ({ breachLayersById, selectedBreaches, visibleLayerIds, visibleVariantIndexByLayerId }) {
      // TODO: get rid of this...
      const layers = selectedBreaches
        .map(breachId => breachLayersById[breachId])
        .map(({ layers }) => layers)
        .map((layers) => layers.filter(layer => visibleLayerIds.indexOf(layer.id) !== -1))
        .reduce((variants, layers) => {
          return [
            ...variants,
            ...layers.map(layer => ({
              ...layer.variants[ visibleVariantIndexByLayerId[layer.id] || 0 ],
              layerId: layer.id
            }))
          ]
        }, [])

      return layers
    },
    currentMapLayerSet (state, { mapLayers }) {
      // TODO: just return this... nothing else
      const layers = mapLayers[state.selectedMapLayerId]

      if (!layers) {
        return []
      }

      return layers.layers
        .map(layer => {
          const variantIndex = state.visibleVariantIndexByLayerId[layer.id]
          return {
            ...layer.variants[variantIndex],
            layerId: layer.id,
            layerTitle: layer.properties.title
          }
        })
        .map(layer => {
          const isActiveLayer = state.visibleLayerIds.some(visibleId => visibleId === layer.layerId)

          if (!isActiveLayer) {
            layer.hide = true
          }

          return layer
        })
    },
    layerPanelView ({ selectedBreaches }) {
      return selectedBreaches && selectedBreaches.length
        ? LAYERPANEL_VIEW_BREACHES
        : LAYERPANEL_VIEW_MAPLAYERS
    },
    panelLayerSets ({ viewerType }, { mapLayers, breachLayers }) {
      return [...mapLayers, ...breachLayers]
    },
    activeLayerSet ({ opacityByLayerId }, { currentMapLayerSet, currentBreachesLayerSet, layerPanelView }) {
      const currentMapLayerSetWithOpacity = currentMapLayerSet
        .map(layer => ({ ...layer, opacity: opacityByLayerId[layer.layerId] || 1 }))

      if (layerPanelView === LAYERPANEL_VIEW_MAPLAYERS) {
        return currentMapLayerSetWithOpacity
      } else if (layerPanelView === LAYERPANEL_VIEW_BREACHES) {
        return [
          ...currentMapLayerSetWithOpacity,
          ...currentBreachesLayerSet.map(layer => ({ ...layer, opacity: opacityByLayerId[layer.layerId] || 1 }))
        ]
      }
    },
    selectedVariantIds (state, { selectedVariants }) {
      return selectedVariants.map(selectedVariant => selectedVariant.map_id)
    },
    selectedVariants ({ selectedBreaches, visibleVariantIndexByLayerId }, { panelLayerSets }) {
      if (selectedBreaches) {
        return panelLayerSets.reduce((acc, layerSet) => {
          const isSelected = selectedBreaches.includes(layerSet.id)

          if (isSelected) {
            const layer = layerSet.layers[0]
            const selectedIndex = visibleVariantIndexByLayerId[layer.id]
            const selectedVariant = layer.variants[selectedIndex]

            acc.push(selectedVariant)
          }

          return acc
        }, [])
      }
    },
    currentNotifications (state) {
      const { layerSetId, notificationsById } = state
      // const notifications = state.notificationsById

      if (!_.has(notificationsById, layerSetId)) {
        return []
      }
      let notifications = notificationsById[layerSetId]
      return notifications

      // TODO: move this to component that wants to add some custom notifications
      // import stringToHash from './lib/string-to-hash'
      // import {getByIndexFrom, isTruthy} from '@/lib/utils'

      // const getNotificationFrom = fp.get('notification')
      // const getNotification = getNotificationFrom
      // const notificationBreach = state.notifications.breach
      // const notificationMap = state.notifications[layerSetId]
      // const generalNotifications = state.notifications.notifications || []
      // const notificationLayers = fp.get('layers', notificationMap) || []
      // const visibleNotificationLayers = notificationLayers.filter(idIncludedIn(visibleLayerIds))

      // const notificationForLayers = visibleNotificationLayers
      //   .filter(idSameAs(selectedLayerId))
      //   .map(({id, variants, notification: layerNotification}) => {
      //     const variantsIndex = visibleVariantIndexByLayerId[id]
      //     const currentVariant = variants[variantsIndex]
      //     return getNotificationFrom(currentVariant) || layerNotification
      //   })
      //   .filter(isTruthy)

      // const breachNotifications = selectedBreaches
      //   .map(getByIndexFrom(notificationBreach))
      //   .map(getNotification)
      //   .filter(isTruthy)

      // const notificationForSelectedLayer = fp.first(notificationForLayers)
      // const notificationForMap = getNotificationFrom(notificationMap)

      // let notifications = []
      // notifications = notificationForMap ? [notificationForMap] : notifications
      // notifications = notificationForSelectedLayer ? [notificationForSelectedLayer] : notifications
      // notifications = breachNotifications && breachNotifications.length ? [...breachNotifications] : notifications

      // notifications = [...notifications, ...generalNotifications]

      // return notifications.map(message => ({message, type: 'warning', id: stringToHash(message)}))
    }
  }
})
