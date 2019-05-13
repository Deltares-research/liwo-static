import Vue from 'vue'
import Vuex from 'vuex'

import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import pipe from 'lodash/fp/pipe'
import first from 'lodash/fp/first'
import merge from 'lodash/fp/merge'
import reduce from 'lodash/fp/reduce'
import values from 'lodash/fp/values'
import flatMap from 'lodash/fp/flatMap'
import includes from 'lodash/fp/includes'
import cloneDeep from 'lodash/fp/cloneDeep'

import loadBreach from './lib/load-breach'
import { loadLayersetById, extractUnit } from './lib/load-layersets'
import loadGeojson from './lib/load-geojson'
import loadCombinedScenario from './lib/load-combined-scenario'
import { normalizeLayers } from './lib/layer-parser'
import { probabilityConfig } from './lib/probability-filter'
import buildLayersetNotifications from './lib/build-layerset-notifications'
import stringToHash from './lib/string-to-hash'
import { BREACH_SELECTED } from './lib/liwo-identifiers'
import mapConfig from './map.config'
import { wrapInProperty, apply, getByIndexFrom, getId } from './lib/utils'

const COMBINED = 'combined'

Vue.use(Vuex)

const isTruthy = val => !!val
const includedIn = includes.convert({rearg: false})
const idSameAs = value => pipe([getId, id => id === value])
const idIncludedIn = collection => pipe([getId, includedIn(collection)])

const BREACHES_PRIMARY_LAYER_ID = 'geo_doorbraaklocaties_primair'
const BREACHES_REGIONAL_LAYER_ID = 'geo_doorbraaklocaties_regionaal'
const LAYERPANEL_VIEW_MAPLAYERS = 'maplayers_view'
const LAYERPANEL_VIEW_BREACHES = 'breaches_view'

export default new Vuex.Store({
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

      if (state.selectedBreaches.indexOf(id) === -1) {
        if (state.selectBreachMultiple) {
          state.selectedBreaches = state.selectedBreaches.concat(id)
        } else {
          state.selectedBreaches = [id]
        }

        state.visibleLayerIds = state.visibleLayerIds.concat(breachLayerIds[0])
        state.visibleVariantIndexByLayerId = { ...state.visibleVariantIndexByLayerId, [ breachLayerIds[0] ]: 0 }
        state.opacityByLayerId = { ...state.opacityByLayerId, [ state.opacityByLayerId[id] ]: 1 }
        state.activeLayerSetId = id
        state.selectedLayerId = breachLayerIds[0]
      } else {
        if (state.selectBreachMultiple) {
          state.selectedBreaches = []
        } else {
          state.selectedBreaches.filter(
            breachId => breachId !== id
          )
        }
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
    async loadLayerSetsById (state, { id, initializeMap }) {
      if (state.layerSetsById && state.layerSetsById[id]) {
        return
      }

      const layersetById = await loadLayersetById(id)
      const layerSet = normalizeLayers(layersetById.layers)
      const notifications = buildLayersetNotifications(layersetById, layerSet[0].id)
      const layerUnits = layersetById.layers.reduce((acc, layer) => {
        acc[layer.legend.layer] = extractUnit(layer.legend.title)
        return acc
      }, {})

      state.commit('setLayerSetById', { id, layerSet })
      state.commit('setPageTitle', layersetById.title)
      state.commit('setLayerUnits', layerUnits)
      state.commit('setLayerSetNotifications', notifications)

      if (initializeMap) {
        state.commit('initToMapLayers', id)
      }
    },
    async addBreach ({ commit, state }, { id, breachName, variantId, layerType, isControllable }) {
      if (Object.keys(state.breachLayersById).indexOf(String(id)) === -1) {
        const breach = await loadBreach(id, layerType, state.viewerType)
        const breachLayers = normalizeLayers(breach.layers)

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
          pipe([
            get('variants'),
            find(['map_id', mapId])
          ])

        const getVariantById = liwoId =>
          pipe([
            get('layers'),
            flatMap(get('variants')),
            find(['map_id', liwoId]),
            wrapInProperty('variant')
          ])

        const getLayerByVariantId = liwoId =>
          pipe([
            get('layers'),
            find(layerByMapId(liwoId)),
            get('properties.name'),
            wrapInProperty('layerName')
          ])

        const getLayerSetTitle =
          pipe([
            get('layerSetTitle'),
            wrapInProperty('layerSetTitle')
          ])

        const getMetaDataForLiwoID = liwoId =>
          pipe([
            map(
              pipe([
                apply([
                  getLayerSetTitle,
                  getLayerByVariantId(liwoId),
                  getVariantById(liwoId)
                ]),
                reduce(merge, {})
              ])
            ),
            find('variant')
          ])

        const mapLiwoIdToBreachLayer = liwoId =>
          pipe([
            values,
            getMetaDataForLiwoID(liwoId)
          ])(breachLayersById)

        metadata = combinedScenario.liwo_ids
          .map(mapLiwoIdToBreachLayer)
          .map(({ layerName, layerSetTitle, variant }) => ({
            [layerSetTitle]: `
              <p>Band: ${layerName}</p>
              <p>${get('title', variant)}</p>
              <p>${get('metadata.title', variant)}</p>
            `
          }))
          .reduce(merge, {})
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

      const layers = cloneDeep(layerSetsById[mapId] || [])
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
    async parsedLayerSet ({ breachProbabilityFilterIndex, selectedBreaches, activeLayerSetId, hiddenLayers, visibleVariantIndexByLayerId, viewerType, breachLayersById }, { activeLayerSet, panelLayerSets }) {
      if (!activeLayerSet) {
        return Promise.resolve([])
      }

      let layers = await Promise.all(
        activeLayerSet.map(async (layer) => {
          if (layer.type === 'json') {
            const geoJsonOptions = viewerType === 'combined' ? { filteredIds: selectedBreaches } : undefined
            const geojson = await loadGeojson(layer, geoJsonOptions)

            if (layer.layer === BREACHES_PRIMARY_LAYER_ID || layer.layer === BREACHES_REGIONAL_LAYER_ID) {
              const filterIndex = breachProbabilityFilterIndex
              const probabilityFilter = probabilityConfig[filterIndex]

              geojson.features = geojson.features
                .filter(feature => (filterIndex === 0 || feature.properties[probabilityFilter.identifier] > 0))

              geojson.features
                .forEach(feature => {
                  feature.properties.selected = selectedBreaches.indexOf(feature.properties.id) !== -1
                })
            }

            return { ...layer, geojson }
          }

          return layer
        })
      )

      let selectedLayers = []

      if (viewerType === COMBINED) {
        return layers.map(layer => {
          if (layer.style === 'LIWO_Basis_Waterdiepte') {
            layer.hideWms = true
            return layer
          }

          if (layer.type === 'json') {
            const activeFeatures = layer.geojson.features.filter(
              feature => selectedBreaches.find(id => id === feature.properties.id)
            )

            activeFeatures.map(activeFeature => {
              const breachLayer = breachLayersById[activeFeature.properties.id].layers[0]

              if (breachLayer.variants.length > 1) {
                const selectedIndex = visibleVariantIndexByLayerId[breachLayer.id]
                const selectedVariant = breachLayer.variants[selectedIndex]
                activeFeature.properties.selectedVariant = selectedVariant.title
                activeFeature.properties.isControllable = false
              }

              return activeFeature
            })
          }

          return layer
        })
      } else if (selectedBreaches.length) {
        // seperate selected markers into its own layer
        layers.map(layer => {
          if (layer.iscontrollayer !== true) return layer

          if (layer.type === 'json') {
            const activeFeatures = layer.geojson.features.filter(
              feature => selectedBreaches.find(id => id === feature.properties.id)
            )

            if (activeFeatures.length) {
              selectedLayers = [...selectedLayers, ...activeFeatures.map(activeFeature => {
                activeFeature.properties.selected = true

                const breachLayer = breachLayersById[activeFeature.properties.id].layers[0]

                if (breachLayer && breachLayer.variants.length > 1) {
                  const selectedIndex = visibleVariantIndexByLayerId[breachLayer.id]
                  const selectedVariant = breachLayer.variants[selectedIndex]
                  activeFeature.properties.selectedVariant = selectedVariant.title
                }

                // remove feature from its current layer
                layer.geojson.features = layer.geojson.features.filter(
                  feature => !includedIn(selectedBreaches, feature.properties.id)
                )

                layer.geojson.totalFeatures = layer.geojson.features.length

                // create layer for selected feature
                return {
                  ...layer,
                  hide: hiddenLayers.includes(activeFeature.properties.id),
                  namespace: layer.namespace,
                  layer: BREACH_SELECTED,
                  layerId: BREACH_SELECTED,
                  layerTitle: 'Geselecteerde locatie',
                  geojson: {
                    ...layer.geojson,
                    totalFeatures: 1,
                    features: [activeFeature]
                  }
                }
              })]
            }
          }

          return layer
        })

        return [...layers, ...selectedLayers]
      } else {
        return layers
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
      const getNotificationFrom = get('notification')
      const getNotification = getNotificationFrom
      const notificationBreach = state.notifications.breach
      const notificationMap = state.notifications[mapId]
      const generalNotifications = state.notifications.notifications || []
      const notificationLayers = get('layers', notificationMap) || []
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

      const notificationForSelectedLayer = first(notificationForLayers)
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
