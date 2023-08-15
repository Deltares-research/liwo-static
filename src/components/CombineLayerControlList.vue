<template>
  <ul :class="classData">
    <li
      class="layer-control-list__item"
      v-for="(layer, index) in layers"
      :key="layer.breachBandId"
      @click="selectLayer(layer)"
    >
      <combine-layer-control
        v-if="layer"
        :id="layer.breachBandId"
        :active="isActive(layer)"
        :layer="layer"
        @update:layer="layer => updateLayer(layer, index)"
        @select:layer="selectLayer"
        @select:variant="selectVariant"
      />
    </li>
    <li v-if="$slots.default">
      <slot></slot>
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'

import CombineLayerControl from './CombineLayerControl'

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
    selectVariant (evt) {
      this.$emit('select:variant', evt)
    },
    isActive (layer) {
      if (!this.selectedLayer) {
        return false
      }

      return this.selectedLayer.breachBandId === layer.breachBandId
    }
  },
  mounted () {
    const firstLayer = _.first(this.layers)
    if (firstLayer) {
      this.selectLayer(firstLayer)
    }
  },
  components: {
    CombineLayerControl
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
