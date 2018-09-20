import Vue from 'vue'
import Vuex from 'vuex'

import loadBreach from './lib/load-breach'
import { loadLayersetById } from './lib/load-layersets'
import loadGeojson from './lib/load-geojson'
import { normalizeLayers } from './lib/layer-parser'

Vue.use(Vuex)

const BREACHES_LAYER_ID = 'geo_doorbraaklocaties_primair'
const LAYERPANEL_VIEW_MAPLAYERS = 'maplayers_view'
const LAYERPANEL_VIEW_BREACHES = 'breaches_view'

export default new Vuex.Store({
  state: {
    breachLayersById: [],
    layerSetsById: {},
    mapId: 0,
    visibleLayerIds: [],
    visibleVariantIndexByLayerId: {},
    opacityByLayerId: {},
    selectedLayerId: 0,
    selectedBreaches: [],
    selectedLayerSet: 0
  },
  mutations: {
    addBreachLayer (state, { id, breachLayer, breachName }) {
      state.breachLayersById = { ...state.breachLayersById, [ id ]: { layers: breachLayer, layerSetTitle: breachName } }
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
    setSelectedBreach (state, id) {
      const index = state.selectedBreaches.indexOf(id)
      const updatedBreaches = [ ...state.selectedBreaches ]

      if (index === -1) {
        updatedBreaches.push(id)
      } else {
        updatedBreaches.splice(index, 1)
      }

      state.selectedBreaches = updatedBreaches
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
    hideLayerById (state, id) {
      state.visibleLayerIds = state.visibleLayerIds.filter(layerId => layerId !== id)
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
    }
  },
  actions: {
    async loadLayerSetsById (state, id) {
      if (state.layerSetsById && state.layerSetsById[id]) {
        return
      }
      const layersetById = await loadLayersetById(id)
      const layerSet = normalizeLayers(layersetById.layers)

      state.commit('setLayerSetById', { id, layerSet })
    },
    async loadBreach ({ commit, state }, { id, breachName }) {
      if (Object.keys(state.breachLayersById).indexOf(String(id)) !== -1) {
        return
      }
      const breach = await loadBreach(id)
      const breachLayer = normalizeLayers(breach.layers)

      commit('addBreachLayer', { id, breachLayer, breachName })
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
      return Object.keys(breachLayersById)
        .filter((id) => selectedBreaches.some(breachId => breachId === Number(id)))
        .map(breachId => breachLayersById[breachId])
    },
    currentLayerSet (state, { mapLayers, breachLayers, layerPanelView }) {
      if (layerPanelView === LAYERPANEL_VIEW_MAPLAYERS) {
        return mapLayers[state.selectedLayerSet]
      } else if (layerPanelView === LAYERPANEL_VIEW_BREACHES) {
        return breachLayers[state.selectedLayerSet]
      }
    },
    layerPanelView ({ selectedBreaches }) {
      return selectedBreaches && selectedBreaches.length
        ? LAYERPANEL_VIEW_BREACHES
        : LAYERPANEL_VIEW_MAPLAYERS
    },
    panelLayerSet (state, { currentLayerSet }) {
      return currentLayerSet
    },
    activeLayerSet ({ visibleLayerIds, visibleVariantIndexByLayerId }, { currentLayerSet }) {
      if (!currentLayerSet) {
        return []
      }

      return currentLayerSet.layers
        .filter(({ id }) => visibleLayerIds.some(visibleId => visibleId === id))
        .map(layer => {
          const variantIndex = visibleVariantIndexByLayerId[layer.id]
          return { ...layer.variants[variantIndex], layerId: layer.id, layerTitle: layer.properties.title }
        })
    },
    parsedLayerSet (state, { activeLayerSet }) {
      if (!activeLayerSet) {
        return Promise.resolve([])
      }

      return Promise.all(
        activeLayerSet.map(async (layer) => {
          if (layer.type === 'json') {
            const geojson = await loadGeojson(layer)

            if (layer.layer === BREACHES_LAYER_ID) {
              geojson.features.forEach(feature => {
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
