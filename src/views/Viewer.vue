<template>
  <div class="viewer">
    <liwo-map :items="items"/>
    <layer-panel :items="items" @open-export="showExport = true" />
    <export-popup v-if="showExport" @close="showExport = false" />
  </div>
</template>

<script>
import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap.vue'

import '@/lib/leaflet-hack'
import { loadLayersetById } from '@/lib/load-layersets'
import fetchJSONLayer from '@/lib/fetch-json-layer'

export default {
  data () {
    return {
      title: '',
      id: 0,
      items: [],
      layerSet: undefined,
      activeLayerSet: undefined,
      showExport: false
    }
  },
  async mounted () {
    const { title, id, layers } = await loadLayersetById(this.$route.params.id)

    this.title = title
    this.id = id
    this.items = layers
  },
  components: {
    ExportPopup,
    LayerPanel,
    LiwoMap
  },
  methods: {
    parseVariant (variant) {
      if (variant.map.type === 'WMS') {
        return { ...variant.map }
      }

      if (variant.map.type === 'json') {
        return { ...variant.map }
      }
    }
  },
  watch: {
    items (layers) {
      const parsedLayers = layers.map(layer => {
        return {
          id: layer.id,
          properties: layer,
          variants: layer.variants.map(this.parseVariant)
        }
      })

      this.layerSet = parsedLayers

      Promise.all(
        parsedLayers.map(async (layer) => {
          const variant = layer.variants[0]

          return variant.type === 'json'
            ? { ...variant, geojson: await fetchJSONLayer(variant) }
            : variant
        })
      )
        .then(activeLayers => {
          this.activeLayerSet = activeLayers
        })
    }
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
