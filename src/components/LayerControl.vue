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
      <label v-if="variant.length" :key="title">
        <span class="layer-control__options-subject">{{ title }}:</span>
        <layer-control-select
          :key="index"
          name="layer-variant"
          :options="getLayerVariantOptionsWithFallback(variant, breachBandId, title)"
          :modelValue="selectedVariantIndexByBreachBandId[breachBandId][title]"
          @update:modelValue="setLayerVariant(breachBandId, title, $event)"
          v-test="'variant-select'"
        />
      </label>
    </template>
  </div>
    <!-- TODO: this is not a layer setting. Move this to an application settings pane. -->
  <div v-if="!breachId && layerOptions.length > 1" class="layer-control__options">
    <!-- TODO: this now  shows up for each band reorganize -->
    <label>
      <layer-control-select
        name="layer-variant"
        :options="layerOptions"
        v-model="selectedLayerIndex"
        :modelValue="selectedLayerIndex"
        @update:modelValue="selectLayerOption($event)"
        v-test="'variant-select'"
      />
    </label>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import _ from 'lodash'

import store from '@/store'

import LayerPopup from '@/components/LayerPopup.vue'
import LayerControlSelect from '@/components/LayerControlSelect.vue'

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
      selectedLayerIndex: null,
      breachId: null,
      breachBandId: null,
      layerVariantOptions: {}
    }
  },
  mounted () {
    this.breachId = _.get(this.layer, 'breachId')
    this.breachBandId = _.get(this.layer, 'breachBandId')
    this.selectedLayerIndex = _.get(this.layer, 'properties.selectedVariant')

    if (this.breachId) {
      let indexes = this.variantFilterPropertiesIndex(this.breachId)
      if (typeof this.selectedLayerIndex === 'number') {
        indexes = this.getOptionsByVariantId(this.selectedLayerIndex)
      }

      store.commit('setSelectedVariantIndexByBreachBandId', { selectedIndex: indexes, breachBandId: this.breachBandId })
    }

    this.setLayerVariantOptions()
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
    },
    metadata () {
      const variant = _.get(this.layer.variants, this.selectedLayerIndex)
      const result = _.get(variant, 'metadata')
      return result
    },
    showLayers () {
      return this.layer.variants.map(vari => {
        return this.variantFilterProperties[_.get(this.layer, 'breachId')].map(prop => {
          return vari.properties[prop]
        })
      })
    },
    layerOptions () {
      const variants = _.get(this.layer, 'variants', [])
      return variants.map((variant, index) => {
        return { value: index, title: variant.title }
      })
    }
  },
  methods: {
    ...mapActions(['setSelectedVariantIndexes']),
    isEmptyObject (obj) {
      return _.isEmpty(obj)
    },
    selectedLayerVariantOptions () {
      const indexes = this.selectedVariantIndexByBreachBandId[this.breachBandId]

      return Object.entries(indexes).map(([key, value]) => {
        const layerVariantOptions = _.get(this.layerVariantOptions, key, {})
        // TODO: assumption that if title not available, the value is null
        return {
          name: key,
          value: _.get(layerVariantOptions, `[${value}].title`, null)
        }
      })
    },

    setLayerVariantOptions (variantName = null) {
      const name = _.get(this.variantFilterProperties, `[${this.breachId}][0]`, '')
      variantName = variantName || name
      if (!variantName) {
        return
      }
      const variantOptions = {}
      const currentVariant = this.layer.variants[this.selectedLayerIndex]
      this.variantFilterProperties[_.get(this.layer, 'breachId')].forEach(prop => {
        this.layer.variants.forEach(variant => {
          // If the property is empty, don't show
          if (variant.properties[prop] === undefined || variant.properties[prop] === null) { return }

          // If dreigende overstroming is off and the variant has dreigende overstroming, don't show
          if (!this.imminentFlood && variant.properties['Dreigende overstroming'] === 1) {
            return
          }

          let checkVariantAvailable = true
          // Always check if options are available for the selected Overschrijdingsfrequentie
          if (prop !== name) {
            checkVariantAvailable = variant.properties[name] === currentVariant.properties[name]
          }

          // Always add all Overschrijdingsfrequenties
          if (checkVariantAvailable) {
            // First time adding the prop
            if (!variantOptions[prop]) {
              variantOptions[prop] = [{
                title: variant.properties[prop],
                value: 0
              }]
            }
            // Check if prop not already in list.
            if (variantOptions[prop] &&
              !_.get(variantOptions, prop, []).find(opt => opt.title === variant.properties[prop])) {
              variantOptions[prop].push({
                title: variant.properties[prop],
                value: variantOptions[prop].length
              })
            }
          }

          if (prop === 'Overschrijdingsfrequentie') {
            variantOptions[prop] = variantOptions[prop].filter(option => {
              const probability = matchValueToProbability(option.title)
              return this.selectedProbabilities.includes(probability) ||
                (this.imminentFlood && variant.properties['Dreigende overstroming'] === 1)
            })
          }
        })
      })
      this.layerVariantOptions = variantOptions
      return variantOptions
    },
    getLayerVariantOptionsWithFallback (variantOptions, breachBandId, title) {
      const selectedVariant = this.selectedVariantIndexByBreachBandId[breachBandId][title]

      if (selectedVariant > variantOptions.length - 1) {
        return [
          ...variantOptions,
          {
            title: 'Geen data beschikbaar',
            value: selectedVariant,
            disabled: true
          }
        ]
      }

      return variantOptions
    },
    getOptionsByVariantId (variantIndex) {
      const variant = this.layer.variants[variantIndex]
      const indexes = {}
      Object.entries(_.get(this.variantFilterProperties, this.breachId, {})).forEach(filter => {
        const options = _.get(this.setLayerVariantOptions(), filter[1], []).find(options => {
          return options.title === variant.properties[filter[1]]
        })
        indexes[filter[1]] = _.get(options, 'value', null)
      })
      return indexes
    },
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
    setLayerVariant (breachBandId, title, value) {
      this.selectedVariantIndexByBreachBandId[breachBandId][title] = value

      const selectedLayerVariantOptions = this.selectedLayerVariantOptions()
      const filteredVariantOptions = selectedLayerVariantOptions.filter(option => option.value !== null)
      // TODO: Find the correct variant for the selection of options.
      let variant = this.layer.variants
        .find(variant => filteredVariantOptions
          .every(option => variant.properties[option.name] === option.value)
        )

      if (!variant) {
        const val = filteredVariantOptions.find(opt => opt.name === title)
        variant = this.layer.variants
          .find(variant => variant.properties[title] === val.value)
      }

      const index = this.layer.variants
        .findIndex(object => object.layer === variant.layer)

      this.selectedLayerIndex = index
      this.selectLayerOption(index)

      if (this.breachId) {
        let indexes = this.variantFilterPropertiesIndex(this.breachId)

        if (typeof this.selectedLayerIndex === 'number') {
          indexes = this.getOptionsByVariantId(this.selectedLayerIndex)
        }

        store.commit('setSelectedVariantIndexByBreachBandId', { selectedIndex: indexes, breachBandId: this.breachBandId })
        this.setSelectedVariantIndexes({ selectedIndex: indexes })
      }
    },
    selectLayerOption (index) {
      this.selectedLayerIndex = index

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
    },
    selectedProbabilities (newVal, oldVal) {
      if (!newVal) { return }
      if (newVal !== oldVal) {
        const variantIndex = _.get(this.selectedVariantIndexByBreachBandId, `[${this.breachBandId}].Overschrijdingsfrequentie`, 0)
        this.setLayerVariant('Overschrijdingsfrequentie', this.layerVariantOptions.Overschrijdingsfrequentie[variantIndex].value)
      }
    },
    imminentFlood () {
      this.setLayerVariantOptions()
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
