<template>
  <div class="layerpanel-item">
    <h3
      class="layerpanel-item__title"
      v-if="title"
    >
      { title }
    </h3>
    <layer-control-list :layers="layers" />
  </div>
</template>

<script>
import LayerControlList from './LayerControlList'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false
    }
  },
  components: {
    LayerControlList
  }
}
</script>

<style>

</style>
