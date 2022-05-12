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
      <p class="layer-control__title">
        {{ layer.properties.title }}
      </p>
    </div>
  </form>
  <!-- TODO: this is not a layer setting. Move this to an application settings pane. -->
  <div v-if="!isEmptyObject(layerVariantOptions)" class="layer-control__options">
    <!-- TODO: this now  shows up for each band reorganize -->
    <template v-for="(variant, title, index) in layerVariantOptions">
      <label v-if="variant.length" :key="index">
        <span class="layer-control__options-subject">{{ title }}:</span>
        <layer-control-select
          :key="index"
          name="layer-variant"
          :options="variant"
          v-model="selectedIndexByVariant[title]"
          @change="setLayerVariant(title)"
          v-test="'variant-select'"
        />
      </label>
    </template>
  </div>
  <div class="layer-control__options">
    <div class="layer-control__range" v-test="'transparancy-input'">
      <label for="`layer-${id}-trans`">Transparantie: </label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        :name="`layer-${id}-trans`"
        value="0"
        @change.stop="setTransparancy"
      />
    </div>
    <button
      v-if="metadata"
      class="layer-control__info"
      v-test="'info-toggle'"
      @click="togglePopup"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
      </svg>
    </button>
    <layer-popup
      v-if="popupIsOpen"
      :metadata="metadata"
      @close="togglePopup"
    />
  </div>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'

import LayerPopup from '@/components/LayerPopup'
import LayerControlSelect from '@/components/LayerControlSelect'

import { matchValueToProbability } from '@/lib/probability-filter'

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
      popupIsOpen: false,
      noDataAvailableForSelection: false,
      selectedLayerIndex: 0,
      selectedIndexByVariant: null,
      layerVariantOptions: {}
    }
  },
  mounted () {
    const breachId = _.get(this.layer, 'breachId')
    this.selectedIndexByVariant = this.variantFilterPropertiesIndex(breachId)
    this.setLayerVariantOptions()
  },
  computed: {
    ...mapGetters(['variantFilterPropertiesIndex']),
    ...mapState(['variantFilterProperties', 'selectedProbabilities']),
    selectedVariantIndex () {
      // get the selectedVariant from the layer
      const index = _.get(this.layer, 'properties.selectedVariant', 0)
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
    metadata () {
      const variant = _.get(this.layer.variants, this.selectedLayerIndex)
      const result = _.get(variant, 'metadata')
      return result
    },
    selectedLayerVariantOptions () {
      return Object.entries(this.selectedIndexByVariant).map(([key, value]) => {
        const layerVariantOptions = _.get(this.layerVariantOptions, key, {})
        // TODO: assumption that if title not available, the value is null
        return {
          name: key,
          value: _.get(layerVariantOptions, `[${value}].title`, null)
        }
      })
    },
    showLayers () {
      return this.layer.variants.map(vari => {
        return this.variantFilterProperties[_.get(this.layer, 'breachId')].map(prop => {
          return vari.properties[prop]
        })
      })
    }
  },
  methods: {
    isEmptyObject (obj) {
      return _.isEmpty(obj)
    },
    setLayerVariantOptions (name, value) {
      const breachId = _.get(this.layer, 'breachId')
      const variantName = name || _.get(this.variantFilterProperties, `[${breachId}][0]`, '')
      const variantValue = value || _.get(this.layer, `variants[0].properties[${variantName}]`)

      if (!variantName) { return }

      const variantOptions = {}

      const updateVariantOptions = (variant, prop) => {
        if (!variant.properties[prop]) { return }

        if (!variantOptions[prop]) {
          variantOptions[prop] = [{
            title: variant.properties[prop],
            value: 0
          }]
        }

        if (variantOptions[prop] &&
          !_.get(variantOptions, prop, []).find(opt => opt.title === variant.properties[prop])) {
          variantOptions[prop].push({
            title: variant.properties[prop],
            value: variantOptions[prop].length
          })
        }

        if (prop === 'Overschrijdingsfrequentie') {
          variantOptions[prop] = variantOptions[prop].filter(option => {
            const probability = matchValueToProbability(option.title)
            return this.selectedProbabilities.includes(probability)
          })
        }
      }

      this.layer.variants.forEach(variant => {
        // For each variant add the options for the chosen variantName
        updateVariantOptions(variant, variantName)

        // For the chosen variantName find the options of variants available
        if (variant.properties[variantName] === variantValue) {
          this.variantFilterProperties[_.get(this.layer, 'breachId')].forEach(prop => {
            // Check if a real value
            updateVariantOptions(variant, prop)
          })
        }
      })

      this.layerVariantOptions = variantOptions
    },
    setTransparancy ({ target }) {
      // Create a copy of the layer with the new opacity
      const layer = { ...this.layer }
      let opacity = 1 - _.toNumber(target.value)

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
    setLayerVariant (title) {
      // Only update the variants fields if a different Overschrijdingsfrequentie is chosen..
      if (this.selectedLayerVariantOptions[0].name === title) {
        const value = this.selectedLayerVariantOptions[0].value
        this.setLayerVariantOptions(title, value)
      }

      const variant = this.layer.variants
        .find(variant => this.selectedLayerVariantOptions
          .every(option => variant.properties[option.name] === option.value)
        )

      if (!variant) {
        return
      }
      const index = this.layer.variants
        .findIndex(object => object.layer === variant.layer)

      this.selectedLayerIndex = index

      // inform everybody up the tree that a variant for this layer changed
      this.$emit('select:variant', {
        layer: this.layer,
        variant,
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
    },
    selectedProbabilities (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setLayerVariantOptions()
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
