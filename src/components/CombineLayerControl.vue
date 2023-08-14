<template>
<div
  :class="classData"
  :data-name="layer.properties.title"
  >
  <form class="layer-control__main" v-test="'layer-toggle'">
    <input
      type="checkbox"
      class="sr-only layer-control__vis-checkbox"
      :name="`layer-${id}-vis`"
      :id="`layer-${id}-vis`"
      value="zichtbaar"
      :checked="layer.properties.visible"
      @change="toggleLayer"
    />
    <label
      class="layer-control__vis-label"
      :for="`layer-${id}-vis`"
      v-test="'layer-control'"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M59 28c-3-5-12-16-27-16S8 23 5 28v6c3 5 12 16 27 16s24-11 27-16v-6zm-27-7a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 24c-15 0-22-14-22-14s3-6 10-10l-2 4a14 14 0 1 0 28 3c0-5-4-8-9-10 12 2 17 13 17 13s-7 14-22 14z"/>
      </svg>
      <span class="sr-only">Zichtbaarheid</span>
    </label>
    <div class="layer-control__identifiers">
      <span class="layer-control__title">
        {{ layer.properties.title }}
      </span>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        :name="`layer-${id}-trans`"
        class="layer-control__transparancy-slider"
        value="0"
        @change.stop="setTransparancy"
      />
    </div>
  </form>

</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

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
    }
  },
  computed: {
    ...mapGetters(['variantFilterPropertiesIndex']),
    ...mapState(['variantFilterProperties', 'selectedProbabilities', 'selectedVariantIndexByBreachBandId', 'imminentFlood']),
    id () {
      return this.layer.breachBandId
    },
    classData () {
      return {
        'layer-control': true,
        'layer-control--active': this.active
      }
    },
    layerSetId () {
      return parseInt(this.$route.params.id, 10)
    }
  },
  methods: {
    ...mapActions(['setSelectedVariantIndexes']),

    setTransparancy ({ target }) {
      // Create a copy of the layer with the new opacity
      const layer = { ...this.layer }
      let opacity = 1 - parseFloat(target.value, 10)

      if (opacity < 0) {
        opacity = 0
      }

      if (opacity > 1) {
        opacity = 1
      }

      this.$emit('update:layer', {
        ...layer,
        properties: {
          ...layer.properties,
          opacity
        }
      })
    },
    selectLayerOption (index) {
      this.$emit('select:variant', {
        layer: this.layer,
        variant: this.layer.variants[index],
        index
      })
    },
    selectLayer () {
      this.$emit('select:layer', this.layer)
    },
    toggleLayer () {
      this.layer.properties.visible = !this.layer.properties.visible
      this.$emit('update:layer', this.layer)
    },
    togglePopup () {
      this.popupIsOpen = !this.popupIsOpen
    }
  },
  watch: {
    // Always close meta when switching layers
    active (isActive) {
      if (!isActive) {
        this.popupIsOpen = false
      }
    }
  }
}
</script>

<style>
@import './variables.css';
@import 'combine-layer-control.css';
</style>
