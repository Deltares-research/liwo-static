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
import stringToHash from './lib/string-to-hash'
import mapConfig from './map.config'
import { wrapInProperty, apply, getByIndexFrom, getId } from './lib/utils'

const COMBINED = 'combined'

Vue.use(Vuex)

const isTruthy = val => !!val
const includedIn = fp.includes.convert({rearg: false})
const idSameAs = value => fp.pipe([getId, id => id === value])
const idIncludedIn = collection => fp.pipe([getId, includedIn(collection)])

const LAYERPANEL_VIEW_MAPLAYERS = 'maplayers_view'
const LAYERPANEL_VIEW_BREACHES = 'breaches_view'

export default new Vuex.Store({
  // TODO: cleanup state (Map, Reach Overview, Combine)
  state: {
    viewerType: undefined,
    activeLayerSetId: undefined,
    breachLayersById: [],
    breachProbabilityFilterIndex: 0,
    layerSetsById: {},
    mapId: 0,
    pageTitle: undefined,
    visibleLayerIds: [],
    visibleVariantIndexByLayerId: {},
    opacityByLayerId: {},
    selectedLayerId: 0,
    selectedMapLayerId: 0,
    selectedBreaches: [],
    // alow to select multiple breaches
    selectBreachMultiple: false,
    selectedLayerSetIndex: 0,
    visibleBreachLayers: {},
    layerUnits: {},
    notifications: [],
    combinedScenario: undefined,
    hiddenLayers: [],
    currentBand: undefined
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
    setMapId (state, id) {
      state.mapId = id
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
        state.activeLayerSetId = id
        state.selectedLayerId = breachLayerIds[0]
      } else {
        state.visibleLayerIds = state.visibleLayerIds.filter(layerId => breachLayerIds.indexOf(layerId) === -1)
        state.visibleVariantIndexByLayerId = { ...state.visibleVariantIndexByLayerId, ...breachLayerIds.reduce((visibleVariants, id) => ({ ...visibleVariants, [ id ]: 0 }), {}) }
        state.activeLayerSetId = state.selectedBreaches[0]
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
    initToMapLayers (state, mapId) {
      const currentLayerSet = state.layerSetsById[mapId]
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
    setActiveLayerSetId (state, id) {
      state.activeLayerSetId = id
    },
    setProbabilityFilterIndex (state, index) {
      state.breachProbabilityFilterIndex = index
      // TODO: apply filter to layer
      this.commit('resetToMapLayers')
    },
    setLayerSetNotifications (state, layerSetNotifications) {
      state.notifications = Object.assign(state.notifications, layerSetNotifications)
    },
    setBreachNotifications (state, breachNotifications) {
      state.notifications = Object.assign(state.notifications, breachNotifications)
    },
    addNotification (state, notification) {
      const notifications = state.notifications.notifications || []
      notifications.push(notification)
      state.notifications = Object.assign(state.notifications, { notifications })
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
    async loadLayerSetsById (state, { id, initializeMap, filterByIds, selectMultipleFeatures }) {
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
      state.commit('setLayerSetNotifications', notifications)

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
    async loadCombinedScenario ({commit, state}, { liwoIds, band }) {
      const combinedScenario = await loadCombinedScenario({ liwoIds, band })
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

      return viewerType === COMBINED && combinedScenario
        ? layer
        : undefined
    },
    mapLayers ({ layerSetsById, mapId }, { combinedScenarioAsLayer }) {
      if (!mapId || !layerSetsById) {
        return []
      }

      const layers = fp.cloneDeep(layerSetsById[mapId] || [])
      if (combinedScenarioAsLayer) layers.push(combinedScenarioAsLayer)

      return [{ layers }]
    },
    breachLayers ({ breachLayersById, selectedBreaches }) {
      return selectedBreaches.map(breachId => breachLayersById[breachId])
    },
    currentBreachesLayerSet ({ breachLayersById, selectedBreaches, visibleLayerIds, visibleVariantIndexByLayerId }) {
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
      if (viewerType === COMBINED) {
        return mapLayers
      } else {
        return [...mapLayers, ...breachLayers]
      }
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
      const { mapId, visibleLayerIds, visibleVariantIndexByLayerId, selectedLayerId, selectedBreaches } = state
      const getNotificationFrom = fp.get('notification')
      const getNotification = getNotificationFrom
      const notificationBreach = state.notifications.breach
      const notificationMap = state.notifications[mapId]
      const generalNotifications = state.notifications.notifications || []
      const notificationLayers = fp.get('layers', notificationMap) || []
      const visibleNotificationLayers = notificationLayers.filter(idIncludedIn(visibleLayerIds))

      const notificationForLayers = visibleNotificationLayers
        .filter(idSameAs(selectedLayerId))
        .map(({id, variants, notification: layerNotification}) => {
          const variantsIndex = visibleVariantIndexByLayerId[id]
          const currentVariant = variants[variantsIndex]
          return getNotificationFrom(currentVariant) || layerNotification
        })
        .filter(isTruthy)

      const breachNotifications = selectedBreaches
        .map(getByIndexFrom(notificationBreach))
        .map(getNotification)
        .filter(isTruthy)

      const notificationForSelectedLayer = fp.first(notificationForLayers)
      const notificationForMap = getNotificationFrom(notificationMap)

      let notifications = []
      notifications = notificationForMap ? [notificationForMap] : notifications
      notifications = notificationForSelectedLayer ? [notificationForSelectedLayer] : notifications
      notifications = breachNotifications && breachNotifications.length ? [...breachNotifications] : notifications

      notifications = [...notifications, ...generalNotifications]

      return notifications.map(message => ({message, type: 'warning', id: stringToHash(message)}))
    }
  }
})
