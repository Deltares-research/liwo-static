<template>
  <ul class="layer-control-list">
      <li
        class="layer-control-list__item"
        v-for="layer in layers"
        :key="layer.layerId"
        @click="setSelectedLayerId(layer.layerId)"
      >
        <layer-control
          :active="(layer.layerId === selectedLayerId)"
          :id="layer.layerId"
          :title="layer.layerTitle"
          :subtitle="layer.title"
          :metadata="layer.metadata"
          @toggle="toggleLayerVisibilityById"
          @changeOpacity="setLayerOpacity"
        />
      </li>
    </ul>
</template>

<script>
import LayerControl from './LayerControl'

export default {
  props: {
    layers: {
      type: Array,
      default: []
    }
  },
  computed: {
    selectedLayerId () {
      return this.$store.state.selectedLayerId
    }
  },
  methods: {
    setSelectedLayerId (id) {
      this.$store.commit('setSelectedLayerId', id)
    },
    setLayerOpacity ({ layerId, opacity }) {
      this.$store.commit('setOpacityByLayerId', {
        layerId,
        opacity
      })
    },
    toggleLayerVisibilityById (id) {
      this.$store.commit('toggleLayerById', id)
    }
  },
  components: {
    LayerControl
  }
}
</script>

<style>

</style>
