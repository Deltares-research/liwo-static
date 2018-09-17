import Vue from 'vue'
import Vuex from 'vuex'

import { loadLayersetById } from './lib/load-layersets'
import loadGeojson from './lib/load-geojson'
import { normalizeLayers } from './lib/layer-parser'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    layerSetsById: {},
    mapId: 0,
    visibleLayerIds: [],
    visibleVariantIndexByLayerId: {},
    opacityByLayerId: {},
    selectedLayerId: 0
  },
  mutations: {
    setLayerSetById (state, { id, layerSet }) {
      state.layerSetsById = {
        ...state.layerSetsById,
        [ id ]: layerSet
      }
    },
    setMapId (state, id) {
      state.mapId = id
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
      const layerSet = await loadLayersetById(id)

      state.commit('setLayerSetById', { id, layerSet })
    }
  },
  getters: {
    normalizedLayers (state) {
      const layerSets = state.layerSetsById

      return Object.keys(layerSets)
        .reduce((normalizedLayers, key) => ({
          ...normalizedLayers,
          [ key ]: normalizeLayers(layerSets[key].layers)
        }), {})
    },
    activeLayerSet ({ mapId, visibleLayerIds, visibleVariantIndexByLayerId }, getters) {
      if (!mapId || !getters.normalizedLayers[mapId]) {
        return undefined
      }

      return getters.normalizedLayers[mapId]
        .filter(({ id }) => visibleLayerIds.some(visibleId => visibleId === id))
        .map(layer => {
          const variantIndex = visibleVariantIndexByLayerId[layer.id]
          return { ...layer.variants[variantIndex], layerId: layer.id }
        })
    },
    parsedLayerSet (state, getters) {
      if (!getters.activeLayerSet) {
        return undefined
      }

      return Promise.all(
        getters.activeLayerSet.map(async (layer) => {
          return (layer.type === 'json')
            ? { ...layer, geojson: await loadGeojson(layer) }
            : layer
        })
      )
    }
  }
})
