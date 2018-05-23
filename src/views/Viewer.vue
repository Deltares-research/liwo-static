<template>
  <div class="viewer">
    <liwo-map
      :map-layers="layers"
    />
    <layer-panel
      :layers="layers"
      @open-export="showExport = true"
    />
    <legend-panel
      v-if="selectedLayer"
      :caption="'caption'"
      :layer-name="selectedLayer.name"
      :style-name="selectedLayer.style"
    />
    <segmented-buttons
      v-if="variants.length > 1"
      :items="variants"
      :active-index="selectedVariantIndex"
      @click="selectVariant"
    />
    <export-popup
      v-if="showExport"
      @close="showExport = false"
    />
  </div>
</template>

<script>
import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import SegmentedButtons from '@/components/SegmentedButtons'

import '@/lib/leaflet-hack'
import { loadMapById } from '@/lib/load-layersets'

export default {
  data () {
    return {
      mapConfig: [],
      parsedLayers: [],
      id: 0,
      showExport: false,
      title: ''
    }
  },
  async mounted () {
    const mapConfig = await loadMapById(this.$route.params.id)
    this.mapConfig = mapConfig
  },
  computed: {
    selectedLayer () {
      const selectedLayers = this.parsedLayers
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        return selectedLayers[0] // should only be one
      }
    },
    selectedLayerId () {
      return this.$store.state.selectedLayerId
    },
    selectedVisibleLayerLegend () {
      if (this.selectedLayer && this.visibleLayerIds.some(visibleId => visibleId === this.selectedLayerId)) {
        return this.selectedLayer.legend
      }
      return undefined
    },
    variantTitlesForSelectedLayer () {
      return (this.selectedLayer)
        ? this.selectedLayer.variants.map(({title}) => title)
        : []
    },
    variantIndexForSelectedLayer () {
      return this.$store.state.visibleVariantIndexByLayerId[this.selectedLayerId]
    },
    visibleLayerIds () {
      return this.$store.state.visibleLayerIds
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    }
  },
  watch: {
    layers (layers) {
      if (layers.length === 0) {
        return
      }
      // new layers mean new state init
      this.$store.commit('setSelectedLayerId', layers[0].id)
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    SegmentedButtons
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
  position: relative;
  margin: -1rem auto;
  z-index: 1000;
}

.viewer .legend-panel {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  box-shadow: var(--shadow);
}

</style>
