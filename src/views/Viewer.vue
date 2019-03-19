<template>
  <div class="viewer">
    <liwo-map
      :layers="activeLayerSet"
      :projection="projection"
      @initMap="setMapObject"
    />
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
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import isNumber from 'lodash/fp/isNumber'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import { EPSG_28992, EPSG_3857 } from '@/lib/leaflet-utils/projections'
import { isTruthy, includedIn, notEmpty } from '../lib/utils'

const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'
const bands = ['waterdepth']

const includedInBands = includedIn(bands)

export default {
  data () {
    return {
      parsedLayers: [],
      id: 0,
      liwoIds: [],
      band: null,
      showExport: false,
      projection: this.$route.name === 'combined'
        ? EPSG_3857
        : EPSG_28992
    }
  },
  async mounted () {
    const {id: _mapId, layerIds, band} = this.$route.params
    const mapId = Number(_mapId)
    this.liwoIds = layerIds ? layerIds.split(',').map(id => parseInt(id, 10)) : []
    this.band = band

    if (mapId) {
      this.$store.commit('setMapId', mapId)
      this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
    }

    this.$store.commit('setPageTitle', PAGE_TITLE)
  },
  computed: {
    ...mapState({
      variantIndexForSelectedLayer: (state) => state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }),
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds'
    ]),
    ...mapGetters([
      'activeLayerSet',
      'panelLayerSets'
    ]),
    validLiwoIds () {
      return notEmpty(this.liwoIds) && this.liwoIds
        .map(isNumber)
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
        this.$store.dispatch('loadCombinedScenario', { band: this.band, liwoIds: this.liwoIds })
      }
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
      console.log('CRS', mapObject.options.crs.scale())
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap
  }
}
</script>

<style>
  @import '../components/variables.css';

  .viewer {
    position: relative;
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
