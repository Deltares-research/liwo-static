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
        @open-export="showExport = true"
      />
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
import availableBands from '../lib/available-bands'

const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
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
      parsedLayers: [],
      id: 0,
      showExport: false,
      liwoIds: [],
      band: null,
      projection: EPSG_28992,
      storeWatcher: null
    }
  },
  async mounted () {
    const {id: _mapId, band, layerIds} = this.$route.params
    const mapId = Number(getFirstLayerSetForRoute(this.$route.name, _mapId))

    this.band = band

    this.$store.commit('setViewerType', 'view')
    this.$store.commit('setPageTitle', PAGE_TITLE)
    this.$store.commit('setCurrentBand', this.$route.params.band)

    if (mapId) {
      this.$store.commit('setMapId', mapId)
      await this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
    }

    this.liwoIds = layerIds ? layerIds.split(',').map(id => parseInt(id, 10)) : []

    this.isMounted = true
  },
  beforeDestroy () {
    this.$store.commit('resetSelectedBreaches')
    this.$store.commit('resetBreachLayersById')
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

  .viewer {
    position: relative;
    padding-top: 1rem;
  }

  .viewer__map-wrapper {
    position: relative;
  }

  .viewer__notifications {
    position: absolute;
    top: 1rem;
    z-index: 1000;
    left: 368px;

    /* 100px: 5 * 20px margin, 320px LayerPanel width, 44px map controls width */
    width: calc(100% - 100px - 320px - 44px);
  }

  .viewer__notification {
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
  }

  .viewer .layer-panel {
    position: absolute;
    top: 1rem;
    left: 2rem;
    z-index: 1000;
    box-shadow: var(--shadow);
  }

  .viewer .segmented-buttons {
    position: absolute;
    width: 100%;
    bottom: -1rem;
    z-index: 1000;
  }

  .viewer .legend-panel {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    z-index: 500;
    box-shadow: var(--shadow);
    max-height: calc(100% - 220px); /* height of leaflet controlls */
    overflow-y: auto;
  }
</style>
