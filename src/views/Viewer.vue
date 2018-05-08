<template>
  <div class="viewer">
    <liwo-map />
    <segmented-links
    />
  </div>
</template>

<script>
import LiwoMap from '@/components/LiwoMap.vue'
import SegmentedLinks from '@/components/SegmentedLinks'
import { loadLayersetById } from '@/lib/load-layersets'

export default {
  data () {
    return { name: '', id: 0, layers: [] }
  },
  beforeCreate: async function () {
    const { name, id, layers } = await loadLayersetById(this.$route.params.id)
    Object.assign(this, { name, id, layers })
  },
  components: {
    LiwoMap,
    SegmentedLinks
  }
}
</script>
<style>

</style>
