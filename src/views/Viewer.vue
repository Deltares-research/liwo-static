<template>
  <div class="viewer">
    <liwo-map :map-layers="mapLayers" />
    <segmented-buttons
      v-if="variantTitlesForSelectedLayer.length > 1"
      :items="variantTitlesForSelectedLayer"
      :active-index="variantIndexForSelectedLayer"
      @click="setVisibleVariantIdForSelectedlayer"/>
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
// import loadGeojson from '../lib/load-geojson'

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
      return this.parsedLayers
        .filter(({id}) => this.visibleLayerIds.every(visibleId => visibleId === id))
        .map(layer => {
          const variantIndex = this.$store.state.visibleVariantIndexByLayerId[this.selectedLayerId]
          return layer.variants[variantIndex]
        })
    },
    variantTitlesForSelectedLayer () {
      const selectedLayers = this.parsedLayers
        .filter(({id}) => this.selectedLayerId)

      return (selectedLayers && selectedLayers[0])
        ? selectedLayers[0].variants.map(({title}) => title)
        : []
    },
    visibleLayerIds () {
      return this.$store.state.visibleLayerIds
    },
    selectedLayerId () {
      return this.$store.state.selectedLayerId
    },
    variantIndexForSelectedLayer () {
      return this.$store.state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    }
  },
  watch: {
    layers (layers) {
      // new layers mean new state init
      this.$store.state.selectedLayerId = layers[0].id
      this.parsedLayers = layers.map(layer => {
        this.$store.state.visibleLayerIds.push(layer.id)
        this.$store.state.visibleVariantIndexByLayerId[layer.id] = 0
        return {
          id: layer.id,
          properties: layer,
          variants: layer.variants.map(variant => ({
            ...variant.map,
            title: variant.title
          }))
        }
      })
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

.viewer .segmented-buttons {
  position: relative;
  margin: -1rem auto;
  z-index: 1000;
}

</style>
