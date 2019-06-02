<template>
  <ul :class="classData">
    <li
      class="layer-control-list__item"
      v-for="(layer, index) in layers"
      :key="layer.id"
      @click="selectLayer(layer)"
      >
      <layer-control
        v-if="layer"
        :id="layer.id"
        :active="isActive(layer)"
        :layer.sync="layer"
        @update:layer="updateLayer(layer, index)"
        @select:layer="selectLayer"
        @select:variant="selectVariant"
        >
      </layer-control>
    </li>
    <li v-if="$slots.default">
      <slot></slot>
    </li>
  </ul>
</template>

<script>

import _ from 'lodash'

import LayerControl from './LayerControl'

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
    }
  },
  data () {
    return {
      activeLayerId: null
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
  watch: {
    layers (layers, oldLayers) {
      // if we have new layers, activate the first layer
      if (!layers) {
        return
      }
      if (_.isEmpty(oldLayers)) {
        // if we didn't have layers select the first one
        // TODO: consisder moving this to cleanLayerSet
        this.selectLayer(_.first(layers))
      }
    }
  },
  methods: {
    updateLayer (layer, index) {
      // update layer at index index in the layers list and emit the update event
      let layers = _.clone(this.layers)
      layers[index] = layer
      this.$emit('update:layers', layers)
    },
    selectLayer (layer) {
      this.activeLayerId = layer.id
      this.$emit('select:layer', layer)
    },
    selectVariant (evt) {
      this.$emit('select:variant', evt)
    },
    isActive (layer) {
      if (this.activeLayerId === layer.id) {
        return true
      }
      return false
    }
  },
  mounted () {
    let firstLayer = _.first(this.layers)
    if (firstLayer) {
      this.selectLayer(firstLayer)
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
