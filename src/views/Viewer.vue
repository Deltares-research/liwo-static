<template>
  <div class="viewer">
    <liwo-map :mapLayers="mapLayers" />
    <segmented-buttons :items="variantTitlesForSelectedLayer" />
    <layer-panel :items="layers" @open-export="showExport = true" />
    <export-popup v-if="showExport" @close="showExport = false" />
  </div>
</template>

<script>
import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import SegmentedButtons from '@/components/SegmentedButtons'

import '@/lib/leaflet-hack'
import { loadLayersetById } from '@/lib/load-layersets'
import loadGeojson from '../lib/load-geojson';

export default {
  data () {
    return {
      layers: [],
      parsedLayers: [],
      id: 0,
      items: [],
      showExport: false,
      title: ''
    }
  },
  async mounted () {
    const layerSet = await loadLayersetById(this.$route.params.id)
    this.layers = layerSet.layers
    this.title = layerSet.title
    this.id = layerSet.id
  },
  computed: {
    mapLayers () {
      const variantIndex = 0
      const hiddenLayers = []
      const mapLayers = this.parsedLayers
        .filter(({id}) => hiddenLayers.every(hiddenId => hiddenId !== id))
        .map(layer => layer.variants[variantIndex])
      return mapLayers
    }
  },
  watch: {
    layers (layers) {
      this.parsedLayers = layers.map(layer => ({
          id: layer.id,
          properties: layer,
        variants: layer.variants.map(variant => ({ ...variant.map }))
      }))
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LiwoMap,
    SegmentedButtons
  }
}
</script>

<style>
.viewer {
  position: relative;
}
.viewer .layer-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}
</style>
