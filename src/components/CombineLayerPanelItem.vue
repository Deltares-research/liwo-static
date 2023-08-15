<template>
<div class="layerpanel-item" :class="{'layerpanel-item--collapsed': isCollapsed}" v-test="'layer-panel'">
  <h3
    class="layerpanel-item__title"
    @click="selectFirstLayer"
    >
    <span>{{ title }}</span>
    <button class="layerpanel-item__collapse" @click.stop="toggleCollapse">
      <img class="layerpanel-item__collapse-icon" :src="`${publicPath}icons/baseline-keyboard_arrow_up-24px.svg`" />
    </button>
  </h3>

  <template v-if="!isCollapsed">
    <dl v-for="{key, value} in variantProperties" :key="key">
      <dt>{{key}}</dt>
      <dd>{{value}}</dd>
    </dl>
  </template>

  <combine-layer-control-list
    :layers="layers"
    :selectedLayer="selectedLayer"
    @update:layers="updateLayers"
    @select:layer="selectLayer"
    @select:variant="selectVariant"
    v-if="!isCollapsed"
  >
    <slot></slot>
  </combine-layer-control-list>

</div>
</template>

<script>
import _ from 'lodash'

import CombineLayerControlList from './CombineLayerControlList'
import { mapState } from 'vuex'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Algemeen'
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    selectedLayer: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      // TODO: check why this is needed...
      // shadow copy so collapsed can be changed in the component
      // convert to boolean (twice ~= Boolean(x))
      isCollapsed: !!this.collapsed,
      // path where the server runs (should end in a /)
      publicPath: process.env.BASE_URL
    }
  },
  watch: {
    collapsed (val) {
      this.isCollapsed = !!this.collapsed
    },
    isCollapsed (val) {
      // pass back changes up
      if (!!val !== this.collapsed) {
        this.$emit('update:collapsed', val)
      }
    },
    layers (val) {
      console.log(val)
    }
  },
  computed: {
    ...mapState(['variantFilterProperties']),

    // Get all the variants
    allVariants () {
      return this.layers.reduce((acc, layer) => {
        return [...acc, ...layer.variants]
      }, [])
    },
    currentVariant () {
      return this.allVariants[0]
    },
    variantPropertiesToShow () {
      const layerBreachIds = Object.keys(this.variantFilterProperties)
      return layerBreachIds.length > 0 ? layerBreachIds[0] : []
    },
    variantProperties () {
      const propertyKeys = Object.keys(this.variantPropertiesToShow)
      const variant = this.currentVariant

      return propertyKeys.map(key => {
        return {
          key,
          value: variant.properties[key]
        }
      })
    }
  },
  methods: {
    selectFirstLayer () {
      this.selectLayer(_.first(this.layerSet.layers))
    },
    updateLayers (layers) {
      this.$emit('update:layers', layers)
    },
    selectLayer (layer) {
      this.$emit('select:layer', layer)
    },
    selectVariant (variant) {
      this.$emit('select:variant', variant)
    },
    toggleCollapse () {
      // toggle
      this.isCollapsed = !this.isCollapsed
    }
  },
  components: {
    CombineLayerControlList
  }
}
</script>

<style>
  @import './variables.css';

  .layerpanel-item {
    background-color: var(--yellow);
    border-top: 2px solid var(--light-gray);
  }

  .layerpanel-item__title {
    padding: 10px;
    font-size: 1.2em;
    color: var(--black);
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .layerpanel-item__collapse {
    padding: 0;
    margin: 0;
    height: 1.75rem;
    width: 1.75rem;
    border: 1px solid grey;
    background-color: transparent;
    border-radius: 3px;

    transition: border-color 0.15s ease-in-out;
  }

  .layerpanel-item__collapse:hover,
  .layerpanel-item__collapse:focus {
    border-color: black;
  }

  .layerpanel-item__collapse-icon {
    transition: transform 0.25s ease-in-out;
  }

  .layerpanel-item--collapsed .layerpanel-item__collapse-icon {
    transform: rotate(180deg)
  }
</style>
