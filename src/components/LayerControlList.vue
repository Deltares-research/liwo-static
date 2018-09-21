<template>
  <ul class="layer-control-list">
      <li
        class="layer-control-list__item"
        v-for="layer in layers"
        :key="layer.id"
        @click="setSelectedLayerId(layer.id)"
      >
        <layer-control
          :active="(layer.id === selectedLayerId)"
          :id="layer.id"
          :title="layer.properties.title || layer.properties.name"
          :subtitle="layer.properties.title || layer.legend.title"
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
  .layer-control-list {
    background-color: white;
  }

  .layer-control-list__item {
    border-bottom: 1px solid var(--light-gray)
  }
</style>
