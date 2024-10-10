<template>
  <ul class="layer-control-list">
    <template v-for="(layer, index) in layers">
      <li
        class="layer-control-list__item"
        v-if="layerIsShown(layer)"
        :key="layer.breachBandId"
      >
        <slot
          name="layer-control"
          v-if="layer"
          :layer="layer"
          :updateLayer="layer => updateLayer(layer, index)"
        ></slot>
      </li>
    </template>
    <li v-if="$slots.default">
      <slot></slot>
    </li>
  </ul>
</template>

<script>

import _ from 'lodash'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    },
  },
  methods: {
    updateLayer (layer, index) {
      // update layer at index index in the layers list and emit the update event
      const layers = _.clone(this.layers)
      layers[index] = layer
      this.$emit('update:layers', layers)
    },
    layerIsShown (layer) {
      // If no variant is selected show the layer
      if (!layer?.properties?.selectedVariant) {
        return true
      }
      // If a variant is selected check if it exists for the layer
      const variant = layer.variants.find(
        (variant) => variant.layer === layer.properties.selectedVariant
      )
      return Boolean(variant)
    },
  }
}
</script>

<style>
.layer-control-list {
  background-color: white;
  height: auto;
  overflow: hidden;
}

.layer-control-list__item {
  border-bottom: 1px solid var(--light-gray)
}
</style>
