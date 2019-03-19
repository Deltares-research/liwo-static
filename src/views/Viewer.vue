<template>
  <div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
    <div class="viewer__map-wrapper">
      <liwo-map
        :layers="activeLayerSet"
        :projection="projection"
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
        @open-combine="showCombine = true"
        @open-export-combine="showExportCombine = true"
        @open-import-combine="showImportCombine = true"
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
import isNaN from 'lodash/fp/isNaN'
import negate from 'lodash/fp/negate'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import CombinePopup from '@/components/CombinePopup'
import ExportCombinePopup from '@/components/ExportCombinePopUp'
import ImportCombinePopup from '@/components/ImportCombinePopUp'
import NotificationBar from '@/components/NotificationBar.vue'

import { EPSG_28992, EPSG_3857 } from '@/lib/leaflet-utils/projections'
import { isTruthy, includedIn, notEmpty, notNaN } from '../lib/utils'

const COMBINE = 'combine'
const COMBINED = 'combined'
const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
const bands = ['waterdepth']

const includedInBands = includedIn(bands)

export default {
  components: {
    CombinePopup,
    ExportCombinePopup,
    ImportCombinePopup,
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap
  },
  data () {
    return {
      parsedLayers: [],
      id: 0,
      showExport: false,
      showCombine: false,
      showExportCombine: false,
      showImportCombine: false,
      showExport: false,
      liwoIds: [],
      band: null,
      projection: this.$route.name === COMBINED
        ? EPSG_3857
        : EPSG_28992
    }
  },
  async mounted () {
    const {id: _mapId, layerIds, band} = this.$route.params
    const routeName = this.$route.name
    let mapId = null

    this.liwoIds = layerIds ? layerIds.split(',').map(id => parseInt(id, 10)) : []
    this.band = band

    this.$store.commit('setViewerType', routeName)
    this.$store.commit('setPageTitle', PAGE_TITLE)

    if (this.viewerType === COMBINE) {
      // watch selected variants and update route
      this.$store.watch(
        (state, getters) => getters.selectedVariants,
        ids => {
          if (ids.length) {
            const { id, band } = this.$route.params

            this.$router.replace({
              name: COMBINE,
              params: {
                id,
                layerIds: ids.join(','),
                band
              }
            })
          }
        }
      )
      mapId = 33
    } else if (this.viewerType === COMBINED) {
      mapId = 34
    } else {
      mapId = Number(_mapId)
    }

    if (mapId) {
      this.$store.commit('setMapId', mapId)
      this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
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
    },
  },
  watch: {
    combinedSenarioCanBeLoaded (boolean) {
      if (boolean) {
        this.loadCombinedScenarios()
      }
    },
    viewerType (viewerType) {
      if (viewerType === COMBINED) {
        if (!this.validBand) {
          this.$store.commit('addNotification', 'Er is geen band geselecteerd')
        }
        if (!this.validLiwoIds) {
          this.$store.commit('addNotification', 'Er zijn geen ids geselecteerd')
        }
      }
    },
    validLiwoIds (liwoIds) {
      this.$store.dispatch('setActiveLayersFromVariantIds', liwoIds)
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
      console.log('CRS', mapObject.options.crs.scale())
    },
    loadCombinedScenarios () {
      this.$store.dispatch('loadCombinedScenario', { band: this.band, liwoIds: this.liwoIds })
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    NotificationBar,
    ImportCombinePopup,
    ExportCombinePopup,
    CombinePopup
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
