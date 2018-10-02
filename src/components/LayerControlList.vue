<template>
  <ul class="layer-control-list" :class="{ 'layer-control-list--active': visible }">
    <li
      class="layer-control-list__item"
      v-for="layer in layers"
      :key="layer.id"
    >
      <layer-control
        :active="(layer.id === selectedLayerId)"
        :id="layer.id"
        :title="layer.properties.title || layer.properties.name"
        :subtitle="layer.properties.title || layer.legend.title"
        :metadata="layerMetaData(layer)"
        :variants="layer.variants || []"
        :layerType="layer.legend.layer"
        :visible="layerIsVisible(layer.id)"
        @toggle="toggleLayerVisibilityById"
        @changeOpacity="setLayerOpacity"
        @selectVariant="setVisibleVariant"
        @selectActiveLayer="setSelectedLayerId"
      />
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

import LayerControl from './LayerControl'

export default {
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds',
      'visibleVariantIndexByLayerId'
    ])
  },
  methods: {
    layerMetaData ({ id, variants }) {
      const index = this.visibleVariantIndexByLayerId[id]
      return typeof index !== 'undefined'
        ? variants[index].metadata
        : undefined
    },
    layerIsVisible (id) {
      return this.visibleLayerIds.indexOf(id) !== -1
    },
    setSelectedLayerId (id) {
      console.log('HERE')
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
    },
    setVisibleVariant ({ layerId, variantIndex }) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { layerId, index: variantIndex })
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
    height: 0;
    overflow: hidden;
  }

  .layer-control-list--active {
    height: auto;
  }

  .layer-control-list__item {
    border-bottom: 1px solid var(--light-gray)
  }
</style>
