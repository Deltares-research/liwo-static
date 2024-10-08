<template>
<div class="layerpanel-item" :class="{'layerpanel-item--collapsed': isCollapsed}" v-test="'layer-panel'">
  <h3 class="layerpanel-item__title">
    <span>{{ title }}</span>
    <button class="layerpanel-item__collapse" @click.stop="toggleCollapse">
      <img class="layerpanel-item__collapse-icon" :src="`${publicPath}icons/baseline-keyboard_arrow_up-24px.svg`" alt="Klap kaartlagen in of uit" />
    </button>
  </h3>
  <layer-control-list
    :layers="layers"
    @update:layers="updateLayers"
    v-if="!isCollapsed"
  >
    <template #layer-control="{ layer, updateLayer }">
      <layer-control
        :id="layer.breachBandId"
        :layer="layer"
        @update:layer="updateLayer"
        @select:variant="selectVariant"
      />
    </template>

    <slot></slot>
  </layer-control-list>

</div>
</template>

<script>
import LayerControlList from './LayerControlList.vue'
import LayerControl from './LayerControl.vue'

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
  },
  data () {
    return {
      // TODO: check why this is needed...
      // shadow copy so collapsed can be changed in the component
      // convert to boolean (twice ~= Boolean(x))
      isCollapsed: !!this.collapsed,
      // path where the server runs (should end in a /)
      publicPath: import.meta.env.BASE_URL
    }
  },
  watch: {
    collapsed () {
      this.isCollapsed = !!this.collapsed
    },
    isCollapsed (val) {
      // pass back changes up
      if (!!val !== this.collapsed) {
        this.$emit('update:collapsed', val)
      }
    }
  },
  methods: {
    selectFirstLayer () {
      this.selectLayer(this.layers[0])
    },
    updateLayers (layers) {
      this.$emit('update:layers', layers)
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
    LayerControl
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