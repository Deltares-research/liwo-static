//import Vue from 'vue'
import { createStore } from 'vuex'

import { loadLayerSetById } from './lib/load-layersets'
import { flattenLayerSet } from './lib/layer-parser'
import buildLayerSetNotifications from './lib/build-layerset-notifications'

export default createStore({
  state: {
    // we have three or four levels that can be current/active/selected
    // layerSet -> layers -> variants (-> features|bands)
    // active/current -> currently loaded TODO: use consistent
    // selected -> selected by user

    // We keep track of some state across pages.
    // all layer data (stored so it doesn't need to fetch on changing pages)
    // TODO: consider storing layers by id separate, then  we don't need breach layers
    layerSetsById: {},

    // all notifications, by LayerSetId
    notificationsById: {},

    // This is the filter for probabilities (a string  used to pass to the backend)
    selectedProbabilities: ['lt30', 'f30t300', 'f300t3000', 'f3000t30k', 'gt30k'],
    // This is a specific filter from 'overig' special on imminent flood
    imminentFlood: false,

    // These are the variants used to filter the layer variant options
    variantFilterProperties: {},
  },
  mutations: {
    setLayerSetById (state, { id, layerSet }) {
      // always update the selected variants and selected id's at the smae time
      state.layerSetsById[id] = layerSet
    },
    setLayersByLayerSetId (state, { id, layers }) {
      // update the layers in layerSet id

      state.layerSetsById[id]['layers'] = layers
    },
    setNotificationsById (state, { id, notifications }) {
      // set the notifications
      state.notificationsById[id] = notifications
    },
    addNotificationById (state, { id, notification }) {
      // store a notification
      const notifications = state.notificationsById[id] || []

      // prevent duplicate notifications from being added
      if(notifications.some(existingNotification => existingNotification.message === notification.message)) {
        return
      }

      state.notificationsById = {
        ...state.notificationsById,
        [id]: [
          ...notifications,
          notification
        ]
      }
    },
    // Because notifications can be added in different places and on different times
    // we need to be able to remove separate types of notifications
    clearInfoNotificationsById (state, id) {
      state.notificationsById[id] = state.notificationsById[id].filter(notification => notification.type !== 'info')
    },
    clearWarningNotificationsById (state, id) {
      state.notificationsById[id] = state.notificationsById[id].filter(notification => notification.type !== 'warning')
    },
    setSelectedProbabilities (state, { probabilities }) {
      state.selectedProbabilities = probabilities
    },
    setImminentFlood (state, imminentFlood) {
      state.imminentFlood = imminentFlood
    },
    setVariantFilterProperties (state, { properties, breachId }) {
      state.variantFilterProperties[breachId] = properties
    },
  },
  actions: {
    async loadLayerSetById ({ commit, state }, { id }) {
      /**
       * Skip if we already loaded this layerSet
       */
      if (state.layerSetsById?.[id]) {
        return
      }

      /**
       * Load the layerSet and store it in the state
       */
      const layerSet = await loadLayerSetById(id)
      commit('setLayerSetById', { id, layerSet: layerSet })

      /**
       * Build the notifications and store it in the state
       */
      const layers = flattenLayerSet(layerSet)
      const currentNotifications = state.notificationsById[id] || []
      const notifications = [...currentNotifications, ...buildLayerSetNotifications(layers)]
      commit('setNotificationsById', { id, notifications })
    }
  }
})
