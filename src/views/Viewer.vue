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

export default {
  components: {
    LiwoMap,
    SegmentedLinks
  }
}
</script>
<style>

</style>
