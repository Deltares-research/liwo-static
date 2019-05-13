<template>
<div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
  <div class="viewer__map-wrapper">
    <liwo-map
      :layers="activeLayerSet"
      :projection="projection"
      :clusterMarkers="true"
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
      >
      <!-- add these buttons to the button section of the layer panel -->
      <!-- use named slots after upgrading to Vue 2.6 -->
      <button
        v-if="selectedBreaches.length"
        class="layer-panel__action"
        @click="showCombine = true"
        >
        Selectie combineren
      </button>
      <button
        v-if="selectedBreaches.length"
        class="layer-panel__action"
        @click="showExportCombine = true"
        >
        Selectie exporteren
      </button>
      <button
        class="layer-panel__action"
        @click="showImportCombine = true"
        >
        Selectie importeren
      </button>
    </layer-panel>
    <legend-panel
      v-if="visibleLayerLegend"
      :caption="visibleLayerLegend.title"
      :namespace="visibleLayerLegend.namespace"
      :layer-name="visibleLayerLegend.layer"
      :style-name="visibleLayerLegend.style"
      />
    <combine-popup
      v-if="showCombine"
      @close="showCombine = false"
      />
    <export-combine-popup
      v-if="showExportCombine"
      @close="showExportCombine = false"
      />
    <import-combine-popup
      v-if="showImportCombine"
      @close="showImportCombine = false"
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
import CombinePopup from '@/components/CombinePopup'
import ExportCombinePopup from '@/components/ExportCombinePopUp'
import ImportCombinePopup from '@/components/ImportCombinePopUp'
import NotificationBar from '@/components/NotificationBar.vue'

import { EPSG_3857 } from '@/lib/leaflet-utils/projections'
import { getFirstLayerSetForRoute } from '../lib/layer-set-route-mapping'
import { isTruthy, includedIn, notEmpty, notNaN, getId } from '../lib/utils'
import availableBands from '../lib/available-bands'

const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
const bands = availableBands.map(getId)

const includedInBands = includedIn(bands)

export default {
  components: {
    CombinePopup,
    ExportCombinePopup,
    ImportCombinePopup,
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
      showCombine: false,
      showExportCombine: false,
      showImportCombine: false,
      liwoIds: [],
      band: null,
      projection: EPSG_3857,
      storeWatcher: null
    }
  },
  async mounted () {
    const {id: _mapId, band, layerIds} = this.$route.params
    const mapId = Number(getFirstLayerSetForRoute(this.$route.name, _mapId))

    this.band = band

    this.$store.commit('setViewerType', 'combine')
    this.$store.commit('setPageTitle', PAGE_TITLE)
    this.$store.commit('setCurrentBand', this.$route.params.band)

    if (mapId) {
      this.$store.commit('setMapId', mapId)
      await this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
    }

    this.liwoIds = layerIds ? layerIds.split(',').map(id => parseInt(id, 10)) : []
    this.storeWatcher = this.$store.watch(
      (state, getters) => getters.selectedVariantIds,
      ids => {
        if (ids.length) {
          const { id, band } = this.$route.params

          this.$router.replace({
            name: 'combine',
            params: {
              id,
              layerIds: ids.join(','),
              band
            }
          })
        }
      }
    )
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
      'viewerType',
      'selectedBreaches'
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
    viewerType (viewerType) {
      if (this.isMounted) {
        if (!this.validBand) {
          this.$store.commit('addNotification', 'Er is geen band geselecteerd')
        }
        if (!this.validLiwoIds) {
          this.$store.commit('addNotification', 'Er zijn geen ids geselecteerd')
        }
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
@import './viewer.css';
</style>
