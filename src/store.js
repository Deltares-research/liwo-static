import Vue from 'vue'
import Vuex from 'vuex'

import loadBreach from './lib/load-breach'
import { loadLayersetById } from './lib/load-layersets'
import loadGeojson from './lib/load-geojson'
import { normalizeLayers } from './lib/layer-parser'
import { probabilityConfig } from './lib/probability-filter'

Vue.use(Vuex)

const BREACHES_PRIMARY_LAYER_ID = 'geo_doorbraaklocaties_primair'
const BREACHES_REGIONAL_LAYER_ID = 'geo_doorbraaklocaties_regionaal'
const LAYERPANEL_VIEW_MAPLAYERS = 'maplayers_view'
const LAYERPANEL_VIEW_BREACHES = 'breaches_view'

export default new Vuex.Store({
  state: {
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
    selectedLayerSetIndex: 0,
    visibleBreachLayers: {},
    visibleBreachLayerVariants: {}
  },
  mutations: {
    addBreachLayer (state, { id, breachLayers, breachName }) {
      state.breachLayersById = {
        ...state.breachLayersById,
        [ id ]: { layers: breachLayers, layerSetTitle: breachName, id }
      }
    },
    setLayerPanelView (state, view) {
      state.layerPanelView = view
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
        state.selectedBreaches = state.selectedBreaches.concat(id)
        state.visibleLayerIds = state.visibleLayerIds.concat(breachLayerIds[0])
        state.activeLayerSetId = id
      } else {
        state.selectedBreaches = state.selectedBreaches.filter(breachId => breachId !== id)
        state.visibleLayerIds = state.visibleLayerIds.filter(layerId => breachLayerIds.indexOf(layerId) === -1)
        state.activeLayerSetId = state.selectedBreaches[0]
      }
    },
    hideBreaches (state, breaches) {
      if (typeof breaches === 'number' || typeof breaches === 'string') {
        breaches = [ breaches ]
      }

      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => breaches.indexOf(layerId) === -1)
    },
    showBreaches (state, breaches) {
      if (typeof breaches === 'number' || typeof breaches === 'string') {
        breaches = [ breaches ]
      }

      state.visibleLayerIds = state.visibleLayerIds.concat(breaches)
    },
    setPageTitle (state, title) {
      state.pageTitle = title
    },
    setSelectedLayerId (state, id) {
      state.selectedLayerId = id
    },
    setVisibleVariantIndexForLayerId (state, {index, layerId}) {
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
    setVisibleBreachLayerVariants (state, { variants }) {
      state.visibleVariantIndexByLayerId = {
        ...state.visibleVariantIndexByLayerId,
        ...variants
      }
    },
    resetVisibleLayers (state) {
      state.visibleLayerIds = []
    },
    initToMapLayers (state, mapId) {
      const currentLayerSet = state.layerSetsById[mapId]
      state.visibleLayerIds = currentLayerSet.map(layer => layer.id)
      state.selectedBreaches = []
      state.visibleVariantIndexByLayerId = currentLayerSet
        .reduce((visibleVariants, { id }) => ({ ...visibleVariants, [ id ]: 0 }), {})
    },
    resetToMapLayers (state) {
      const selectedBreaches = state.selectedBreaches
      state.visibleLayerIds = state.visibleLayerIds.filter((layerId) => selectedBreaches.indexOf(layerId) === -1)
      state.selectedBreaches = []
    },
    hideLayerById (state, id) {
      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => layerId !== id)
    },
    hideLayersById (state, layerIds) {
      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => layerIds.some(layerId))
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
    }
  },
  actions: {
    async loadLayerSetsById (state, { id, initializeMap }) {
      if (state.layerSetsById && state.layerSetsById[id]) {
        return
      }

      const layersetById = await loadLayersetById(id)
      const layerSet = normalizeLayers(layersetById.layers)

      state.commit('setLayerSetById', { id, layerSet })
      state.commit('setPageTitle', layersetById.title)
      if (initializeMap) {
        state.commit('initToMapLayers', id)
      }
    },
    async addBreach ({ commit, state }, { id, breachName, layerType }) {
      if (Object.keys(state.breachLayersById).indexOf(String(id)) === -1) {
        const breach = await loadBreach(id, layerType)
        const breachLayers = normalizeLayers(breach.layers)
        const visibleBreachLayers = breachLayers.map((layer) => layer.id)

        commit('addBreachLayer', { id, breachLayers, breachName })
        commit('setVisibleBreachLayers', { breach: id, layers: visibleBreachLayers })
        commit('setVisibleBreachLayerVariants', {
          breach: id,
          variants: breachLayers.reduce((variants, layer) => ({ ...variants, [ layer.id ]: 0 }), {})
        })
      }

      commit('toggleSelectedBreach', id)
    }
  },
  getters: {
    mapLayers ({ layerSetsById, mapId }) {
      if (!mapId || !layerSetsById) {
        return []
      }

      return [{ layers: layerSetsById[mapId] || [] }]
    },
    breachLayers ({ breachLayersById, selectedBreaches }) {
      return selectedBreaches
        .map(breachId => breachLayersById[breachId])
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
        .filter(({ id }) => state.visibleLayerIds.some(visibleId => visibleId === id))
        .map(layer => {
          const variantIndex = state.visibleVariantIndexByLayerId[layer.id]
          return {
            ...layer.variants[variantIndex],
            layerId: layer.id,
            layerTitle: layer.properties.title
          }
        })
    },
    currentLayerSet (state, { mapLayers, breachLayers, layerPanelView }) {
      if (layerPanelView === LAYERPANEL_VIEW_MAPLAYERS) {
        return mapLayers[state.selectedLayerSetIndex]
      } else if (layerPanelView === LAYERPANEL_VIEW_BREACHES) {
        return breachLayers[state.selectedLayerSetIndex]
      }
    },
    layerPanelView ({ selectedBreaches }) {
      return selectedBreaches && selectedBreaches.length
        ? LAYERPANEL_VIEW_BREACHES
        : LAYERPANEL_VIEW_MAPLAYERS
    },
    panelLayerSets (_, { mapLayers, breachLayers, layerPanelView }) {
      if (layerPanelView === LAYERPANEL_VIEW_MAPLAYERS) {
        return mapLayers
      } else if (layerPanelView === LAYERPANEL_VIEW_BREACHES) {
        return breachLayers
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
    parsedLayerSet (state, { activeLayerSet }) {
      if (!activeLayerSet) {
        return Promise.resolve([])
      }

      return Promise.all(
        activeLayerSet.map(async (layer) => {
          if (layer.type === 'json') {
            const geojson = await loadGeojson(layer)

            if (layer.layer === BREACHES_PRIMARY_LAYER_ID || layer.layer === BREACHES_REGIONAL_LAYER_ID) {
              const filterIndex = state.breachProbabilityFilterIndex
              const probabilityFilter = probabilityConfig[filterIndex]

              geojson.features = geojson.features
                .filter(feature => (filterIndex === 0 || feature.properties[probabilityFilter.identifier] > 0))

              geojson.features
                .forEach(feature => {
                  feature.properties.selected = state.selectedBreaches.indexOf(feature.properties.id) !== -1
                })
            }

            return { ...layer, geojson }
          }

          return layer
        })
      )
    }
  }
})
