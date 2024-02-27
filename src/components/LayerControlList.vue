<template>
  <ul :class="classData">
    <template v-for="(layer, index) in layers">
      <li
        class="layer-control-list__item"
        v-if="layerIsShown(layer)"
        :key="layer.breachBandId"
        @click="selectLayer(layer)"
      >
        <slot
          name="layer-control"
          v-if="layer"
          :active="isActive(layer)"
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
    // whether to show this list as an active list
    active: {
      type: Boolean,
      default: true
    },
    selectedLayer: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    classData () {
      return {
        'layer-control-list': true,
        'layer-control-list--active': this.active
      }
    }
  },
  methods: {
    updateLayer (layer, index) {
      // update layer at index index in the layers list and emit the update event
      const layers = _.clone(this.layers)
      layers[index] = layer
      this.$emit('update:layers', layers)
    },
    selectLayer (layer) {
      this.$emit('select:layer', layer)
    },
    isActive (layer) {
      if (!this.selectedLayer) {
        return false
      }

      return this.selectedLayer.breachBandId === layer.breachBandId
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
  },
  mounted () {
    const firstLayer = _.first(this.layers)
    if (firstLayer) {
      this.selectLayer(firstLayer)
    }
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
