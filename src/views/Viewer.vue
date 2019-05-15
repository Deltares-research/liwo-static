<template>
<div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
  <div class="viewer__map-wrapper">
    <liwo-map
      :layers="activeLayerSet"
      :projection="projection"
      :clusterMarkers="false"
      @initMap="setMapObject"
      />
    <ul class="viewer__notifications" v-if="currentNotifications.length">
      <li class="viewer__notification" v-for="{type, message, id} in currentNotifications"
          :key="id">
        <notification-bar
          :type="type"
          :message="message"
          />
      </li>
    </ul>
    <layer-panel
      :layerSets="panelLayerSets"
      >
      <button
        class="layer-panel__action"
        @click="showExport = true"
        >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M18 17v2H6v-2H3v4c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-4h-3z"/>
          <path d="M11 16.5a1.4 1.4 0 0 0 2 0l5.8-7.3a1.4 1.4 0 0 0-1.7-2l-3.1 2V3.4c0-1-1-1.4-2-1.4s-2 .3-2 1.4v5.8l-3-2a1.4 1.4 0 0 0-1.8 2l5.7 7.3z"/>
        </svg>
        Kaart exporteren
      </button>

    </layer-panel>
    <legend-panel
      v-if="visibleLayerLegend"
      :caption="visibleLayerLegend.title"
      :namespace="visibleLayerLegend.namespace"
      :layer-name="visibleLayerLegend.layer"
      :style-name="visibleLayerLegend.style"
      />
    <export-popup
      v-if="showExport"
      :map-object="mapObject"
      :map-layers="activeLayerSet"
      @close="showExport = false"
      />
  </div>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import isNumber from 'lodash/fp/isNumber'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import NotificationBar from '@/components/NotificationBar.vue'

import { EPSG_28992 } from '@/lib/leaflet-utils/projections'
import { getFirstLayerSetForRoute } from '../lib/layer-set-route-mapping'
import { isTruthy, includedIn, notEmpty, notNaN, getId } from '../lib/utils'

// TODO: why so functional?
import availableBands from '../lib/available-bands'
const bands = availableBands.map(getId)
const includedInBands = includedIn(bands)

export default {
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    NotificationBar
  },
  data () {
    return {
      isMounted: false,
      // TODO: is this  used
      parsedLayers: [],
      // id of what?
      id: 0,
      showExport: false,
      // ids of what?
      liwoIds: [],
      band: null,
      projection: EPSG_28992,
      // TODO: is this used?
      storeWatcher: null
    }
  },
  async mounted () {
    const {id: _mapId, band, layerIds} = this.$route.params
    const mapId = Number(getFirstLayerSetForRoute(this.$route.name, _mapId))

    this.band = band

    // TODO: get rid of this, view is  part of the route, remove from the store...
    this.$store.commit('setViewerType', 'view')
    this.$store.commit('setPageTitle', this.$route.params.title)
    this.$store.commit('setCurrentBand', this.$route.params.band)

    if (mapId) {
      this.$store.commit('setMapId', mapId)
      // TODO: why await...
      await this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
    }

    this.liwoIds = layerIds ? layerIds.split(',').map(id => parseInt(id, 10)) : []

    // TODO: remove this...
    this.isMounted = true
  },
  beforeDestroy () {
    // TODO: we should not need this, if state  needs to be removed after view changes,
    // state should be in this view, not in the store...
    this.$store.commit('resetSelectedBreaches')
    this.$store.commit('resetBreachLayersById')
    // storewatcher??? get rid of this...
    if (this.storeWatcher) {
      // teardown watcher
      this.storeWatcher()
    }
  },
  computed: {
    ...mapState({
      variantIndexForSelectedLayer: (state) => state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }),
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds',
      'viewerType'
    ]),
    ...mapGetters([
      'activeLayerSet',
      'panelLayerSets',
      'currentNotifications'
    ]),
    validLiwoIds () {
      return notEmpty(this.liwoIds) && this.liwoIds
        .map(id => isNumber(id) && notNaN(id))
        .every(isTruthy)
    },
    validBand () {
      return includedInBands(this.band)
    },
    combinedSenarioCanBeLoaded () {
      return this.validLiwoIds && this.validBand
    },
    selectedLayer () {
      if (!this.panelLayerSets) {
        return
      }

      const selectedLayers = this.panelLayerSets
        .map((layerSet) => layerSet.layers)
        .reduce((allLayers, layers) => [ ...allLayers, ...layers ], [])
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        // should only be one
        return selectedLayers[0]
      }
    },
    visibleLayerLegend () {
      if (!this.selectedLayer) {
        return undefined
      }

      return {
        ...this.selectedLayer.legend,
        layerType: this.selectedLayer.variants[0].type
      }
    }
  },
  watch: {
    combinedSenarioCanBeLoaded (boolean) {
      if (boolean) {
        this.loadCombinedScenarios()
      }
    },
    validLiwoIds (isValid) {
      if (isValid) {
        this.$store.dispatch('setActiveLayersFromVariantIds', this.liwoIds)
      }
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
    },
    loadCombinedScenarios () {
      this.$store.dispatch('loadCombinedScenario', { band: this.band, liwoIds: this.liwoIds })
    }
  }
}
</script>

<style>
@import '../components/variables.css';
@import  './viewer.css';
</style>
