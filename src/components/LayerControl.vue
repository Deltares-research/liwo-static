<template>
<div
  :class="classData"
  >
  <form class="layer-control__main">
    <input type="checkbox"
           class="sr-only layer-control__vis-checkbox"
           :name="`layer-${id}-vis`"
           :id="`layer-${id}-vis`"
           value="zichtbaar"
           :checked="layer.properties.visible"
           >
    <label
      @click.stop.prevent="(event) => toggleLayer(event)"
      class="layer-control__vis-label"
      :for="`layer-${id}-vis`"
      >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M59 28c-3-5-12-16-27-16S8 23 5 28v6c3 5 12 16 27 16s24-11 27-16v-6zm-27-7a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 24c-15 0-22-14-22-14s3-6 10-10l-2 4a14 14 0 1 0 28 3c0-5-4-8-9-10 12 2 17 13 17 13s-7 14-22 14z"/>
      </svg>
      <span class="sr-only">Zichtbaarheid</span>
    </label>
    <div class="layer-control__identifiers">
      <p class="layer-control__title">
        {{ layer.properties.title }}
      </p>
    </div>
  </form>
  <!-- TODO: this is not a layer setting. Move this to an application settings pane. -->
  <div v-if="variantsOptions.length" class="layer-control__options">
    <!-- TODO: this now  shows up for each band reorganize -->
    <layer-control-select
      name="layer-variant"
      :options="variantsOptions"
      :selected="selectedVariantIndex"
      @change.stop="setLayerVariant"
      />
  </div>
  <div class="layer-control__options">
    <div class="layer-control__range">
      <label for="`layer-${id}-trans`">Transparantie: </label>
      <input type="range" min="0" max="1" step="0.1" :name="`layer-${id}-trans`" value="0" @change.stop="setTransparancy">
    </div>
    <button v-if="metadata" class="layer-control__info" @click="popupIsOpen=true">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
      </svg>
    </button>
    <layer-popup
      v-if="popupIsOpen"
      :metadata="metadata"
      @close="popupIsOpen=false"
      />
  </div>
</div>
</template>

<script>

import _ from 'lodash'

import LayerPopup from '@/components/LayerPopup'
import LayerControlSelect from '@/components/LayerControlSelect'

export default {
  props: {
    layer: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      popupIsOpen: false
    }
  },
  computed: {
    selectedVariantIndex () {
      // get the selectedVariant from the layer
      let index = _.get(this.layer, 'properties.selectedVariant', 0)
      return index
    },
    id () {
      return this.layer.breachBandId
    },
    classData () {
      return {
        'layer-control': true,
        'layer-control--active': this.active
      }
    },
    variantsOptions () {
      const variantsLength = this.layer.variants.length
      if (!variantsLength || variantsLength === 1) {
        return []
      }

      return this.layer.variants.map((variant, index) => ({
        value: Number(index),
        title: variant.title
      }))
    },
    metadata () {
      let variant = _.get(this.layer.variants, this.selectedVariantIndex)
      let result = _.get(variant, 'metadata')
      return result
    }
  },
  methods: {
    setTransparancy ({ target }) {
      // Create a copy of the layer with the new opacity
      let layer = { ...this.layer }
      let opacity = 1 - _.toNumber(target.value)
      if (opacity < 0) {
        opacity = 0
      }
      if (opacity > 1) {
        opacity = 1
      }
      this.$set(layer.properties, 'opacity', opacity)
      this.$emit('update:layer', layer)
    },
    setLayerVariant ({ target }) {
      // inform everybody up the tree that a variant for this layer changed
      let selectedVariantIndex = _.toNumber(target.value)
      this.$emit('select:variant', {
        layer: this.layer,
        variant: this.layer.variants[selectedVariantIndex],
        index: selectedVariantIndex
      })
    },
    selectLayer () {
      this.$emit('select:layer', this.layer)
    },
    toggleLayer (event) {
      let layer = _.clone(this.layer)
      layer.properties.visible = !layer.properties.visible
      this.$emit('update:layer', this.layer)
    }
  },
  watch: {
    // Always close meta when switching layers
    active (isActive) {
      if (!isActive) {
        this.popupIsOpen = false
      }
    }
  },
  components: {
    LayerControlSelect,
    LayerPopup
  }
}
</script>

<style>
@import './variables.css';
@import 'layer-control.css';
</style>
