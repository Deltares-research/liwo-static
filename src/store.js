import Vue from 'vue'
import Vuex from 'vuex'

import _ from 'lodash'

import { loadLayerSetById } from './lib/load-layersets'
import { flattenLayerSet, normalizeLayerSet, cleanLayerSet } from './lib/layer-parser'
import buildLayerSetNotifications from './lib/build-layerset-notifications'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // we have three or four levels that can be current/active/selected
    // layerSet -> layers -> variants (-> features|bands)
    // active/current -> currently loaded TODO: use consistent
    // selected -> selected by user

    // current/active/selected layer,
    // changing these triggers a load of the corresponding data
    layerSetId: 0,

    // TODO: consider storing layers by id separate, then  we don't need breach layers
    layerSetsById: {},

    // We keep track of some state across pages.
    // all layer data (stored so it doesn't need to fetch on changing pages)
    // all notifications, by LayerSetId
    notificationsById: {},

    // This is the filter for probabilities (a string  used to pass to the backend)
    selectedProbabilities: [],
    // This is a specific filter from 'overig' special on imminent flood
    imminentFlood: false,
    probabilityFilter: '',

    // These are the variants used to filter the layer variant options
    variantFilterProperties: {},

    probabilitiesSelected: false
  },
  mutations: {
    setLayerSetById (state, { id, layerSet }) {
      // always update the selected variants and selected id's at the smae time
      Vue.set(state.layerSetsById, id, layerSet)
    },
    setLayerSetId (state, id) {
      state.layerSetId = id
    },
    setLayersByLayerSetId (state, { id, layers }) {
      // update the layers in layerSet id
      Vue.set(state.layerSetsById[id], 'layers', layers)
    },
    setNotificationsById (state, { id, notifications }) {
      // set the notifications
      Vue.set(state.notificationsById, id, notifications)
    },
    addNotificationById (state, { id, notification }) {
      // store a notification
      const notifications = state.notificationsById[id] || []

      state.notificationsById = {
        ...state.notificationsById,
        [id]: [
          ...notifications,
          notification
        ]
      }
    },
    clearNotifications (state) {
      state.notificationsById = {}
    },
    setSelectedProbabilities (state, { probabilities }) {
      state.selectedProbabilities = probabilities
    },
    setProbabilitiesSelected (state, { selected }) {
      state.probabilitiesSelected = selected
    },
    setImminentFlood (state, imminentFlood) {
      state.imminentFlood = imminentFlood
    },
    setVariantFilterProperties (state, { properties, breachId }) {
      state.variantFilterProperties[breachId] = properties
    }
  },
  actions: {
    async loadLayerSetById (state, { id }) {
      // Skip if we already loaded this layerSet
      if (_.has(state.layerSetsById, id)) {
        return
      }
      // Load a layerSet
      // Make  sure you don't add any interaction here  yet.
      // This should just load and clean up, no filtering, no dependency on any view state

      // load the raw layerSet
      const layerSetRaw = await loadLayerSetById(id)
      // the data we get from the api is a bit unorganized so normalize it
      // Actually I think we're  unnormalizing....
      // deep clone before and after or look at  json response to compare what changed
      const layerSetNormalized = normalizeLayerSet(layerSetRaw)
      // There might be some issues that we need to  fix...
      const layerSet = cleanLayerSet(layerSetNormalized)

      // The layers are in a deep  structure. Flatten it before  building the notifications
      const layers = flattenLayerSet(layerSet)

      const notifications = buildLayerSetNotifications(layers)

      // TODO: the function is called setLayerSet[s]
      // but it only loads  the layers of 1 layerSet, make this consistent

      state.commit('setLayerSetById', { id, layerSet: layerSet })

      // TODO: why not in the view...
      state.commit('setNotificationsById', { id, notifications })
    }

  },
  getters: {
    variantFilterPropertiesIndex: (state) => (breachId) => {
      const props = _.get(state.variantFilterProperties, breachId, [])
      return props
        .reduce((arr, val) => ({ ...arr, [val]: 0 }), {})
    },
    layerSet ({ layerSetsById, layerSetId }) {
      // return the current layerSet
      return layerSetsById[layerSetId]
    },
    layers (state, { layerSet }) {
      // flatten all layers and return
      if (!layerSet) {
        return []
      }
      return flattenLayerSet(layerSet)
    },
    currentNotifications (state) {
      const { layerSetId, notificationsById } = state
      const notifications = notificationsById[layerSetId] || []

      return notifications
    }
    // featuresForProbability: (state) => (probability) => {
    //   console.log('featuresForProbability')
    //   const { layerSetId, layerSetsById } = state
    //   const layers = flattenLayerSet(layerSetsById[layerSetId])

    //   return layers
    //     .filter(layer => layer.geojson)
    //     .map(({ geojson }) => geojson.features.filter(({ properties }) => properties[probability] > 0).length)
    //     .reduce((a, b) => a + b, 0)
    // }
  }
})
