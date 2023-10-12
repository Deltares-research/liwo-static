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

  <div class="layerpanel-item__info" v-if="!isCollapsed">
    <dl class="layerpanel-item__prop-list" v-if="variantProperties.length > 1" v-test="'variantProperties'">
      <div v-for="{key, value} in variantProperties" :key="key" class="layerpanel-item__prop">
        <dt>{{key}}</dt>
        <dd :title="value">{{value}}</dd>
      </div>
    </dl>
    <button v-test="'change-variant'" v-if="allVariants.length > 1" @click.stop="showChangeVariantPopup" class="btn primary">Wijzig variant</button>
  </div>

  <layer-control-list
    :layers="layers"
    :selectedLayer="selectedLayer"
    @update:layers="updateLayers"
    @select:layer="selectLayer"
    v-if="!isCollapsed"
  >
    <template #layer-control="{ layer, updateLayer }">
      <combine-layer-control
        :id="layer.breachBandId"
        :layer="layer"
        @update:layer="updateLayer"
        @select:layer="selectLayer"
        @select:variant="selectVariant"
      />
    </template>

    <slot></slot>
  </layer-control-list>

  <combine-change-variant-popup
    :breachName="title"
    :allVariants="allVariants"
    :currentVariant="currentVariant"
    @select:variant="selectVariant"
    @close="hideChangeVariantPopup"
    v-if="changeVariantPopupShown"
  >
  </combine-change-variant-popup>

</div>
</template>

<script>
import _ from 'lodash'

import LayerControlList from './LayerControlList.vue'
import CombineLayerControl from './CombineLayerControl.vue'
import CombineChangeVariantPopup from './CombineChangeVariantPopup.vue'
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
      publicPath: import.meta.env.BASE_URL,

      changeVariantPopupShown: false
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
    }
  },
  computed: {
    ...mapState(['variantFilterProperties']),

    // Get all the variants
    allVariants () {
      return this.layers[0].variants
    },
    // Current variant is not saved in store even though it is shared among all layers. Why?
    currentVariant () {
      if (!this.layers.length) {
        return null
      }
      const index = this.layers[0].properties.selectedVariant
      return this.allVariants[index]
    },
    variantPropertiesToShow () {
      const layerBreachIds = Object.keys(this.variantFilterProperties)
      return layerBreachIds.length > 0 ? this.variantFilterProperties[layerBreachIds[0]] : []
    },
    variantProperties () {
      const variant = this.currentVariant

      if (!variant) {
        return []
      }

      const props = this.variantPropertiesToShow
        .filter(key => variant.properties[key] !== null && variant.properties[key] !== undefined)
        .map(key => {
          return {
            key,
            value: variant.properties[key]
          }
        })

      return [
        {
          key: 'Variant',
          value: variant.metadata.title
        },
        ...props
      ]
    }
  },
  methods: {
    showChangeVariantPopup () {
      this.changeVariantPopupShown = true
    },
    hideChangeVariantPopup () {
      this.changeVariantPopupShown = false
    },
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
    LayerControlList,
    CombineLayerControl,
    CombineChangeVariantPopup
  }
}
</script>

<style>
  @import './variables.css';

  .layerpanel-item {
    background-color: var(--yellow);
    border-top: 2px solid var(--light-gray);
  }

  .layerpanel-item__info {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid var(--light-gray);
  }

  .layerpanel-item__prop-list {
    margin-bottom: 0;
  }

  .layerpanel-item__prop {
    display: flex;
    margin-bottom: 6px;
  }

  .layerpanel-item__prop > * {
    margin: 0;
  }

  .layerpanel-item__prop > dt {
    margin-right: .2em;
  }

  .layerpanel-item__prop > dt:after {
    content: ':';
  }

  .layerpanel-item__prop > dd {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    min-width: 0;
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
