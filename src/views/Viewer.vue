<template>
  <div class="viewer">
    <liwo-map />
    <layer-panel :items="items" @open-export="showExport = true" />
    <export-popup v-if="showExport" @close="showExport = false" />
  </div>
</template>

<script>
import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap.vue'
import { loadLayersetById } from '@/lib/load-layersets'

export default {
  data () {
    return { title: '', id: 0, items: [], showExport: false }
  },
  beforeCreate: async function () {
    const { title, id, layers } = await loadLayersetById(this.$route.params.id)
    Object.assign(this, { title, id, items: layers })
  },
  components: {
    ExportPopup,
    LayerPanel,
    LiwoMap
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
