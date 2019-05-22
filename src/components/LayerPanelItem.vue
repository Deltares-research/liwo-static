<template>
  <div class="layerpanel-item" :class="{'layerpanel-item--collapsed': collapsed}">
    <h3
      class="layerpanel-item__title"
      @click="activateFirstLayer"
    >
      <span>{{ title }}</span>
      <button class="layerpanel-item__collapse" @click.stop="toggleCollapse">
        <img class="layerpanel-item__collapse-icon" :src="`/icons/baseline-keyboard_arrow_up-24px.svg`" />
      </button>
    </h3>
    <layer-control-list
      :layers="layers"
      @update:layers="setLayers"
      v-show="!collapsed"

    />
  </div>
</template>

<script>
import _ from 'lodash'

import LayerControlList from './LayerControlList'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Algemeen'
    }
  },
  data: () => ({
    collapsed: false
  }),
  methods: {
    setLayers (layers) {
      // bubble the layers so the parent can use layers.sync
      // see https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier
      this.$emit('update:layers', layers)
    },
    activateFirstLayer () {
      // deactivate all layers
      let layers = _.clone(this.layers)
      _.each(layers, (layer) => { layer.properties.active = false })
      _.first(layers).properties.active = true
      // bubble up
      this.$emit('update:layers', layers)
      // TODO: remove
      // set first layer to active
      this.$store.commit('setSelectedLayerId', this.layers[0].id)
    },
    toggleCollapse () {
      this.collapsed = !this.collapsed
      if (this.collapsed) {
        // TODO: why, remove this?
        this.activateFirstLayer()
      }
    }
  },
  components: {
    LayerControlList
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
    padding: 4px;
    padding-right: 10px;
    line-height: 44px;
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
