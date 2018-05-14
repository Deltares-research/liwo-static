<template>
  <div class="viewer">
    <liwo-map :items="items"/>
    <layer-panel :items="items" />
  </div>
</template>

<script>
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap.vue'
import { loadLayersetById } from '@/lib/load-layersets'

export default {
  data () {
    return { title: '', id: 0, items: [] }
  },
  beforeCreate: async function () {
    const { title, id, layers } = await loadLayersetById(this.$route.params.id)
    Object.assign(this, { title, id, items: layers })
  },
  components: {
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
