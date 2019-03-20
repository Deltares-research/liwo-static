<template>
  <div class="layerpanel-item" :class="{'layerpanel-item--collapsed': collapsed}">
    <h3
      class="layerpanel-item__title"
      v-if="title"
      @click="setActiveLayer"
    >
      <span>{{ title }}</span>
      <button class="layerpanel-item__collapse" @click="toggleCollapse">
        <img class="layerpanel-item__collapse-icon" :src="`/icons/baseline-keyboard_arrow_up-24px.svg`" />
      </button>
    </h3>

    <layer-control-list
      :layers="layers"
      :visible="!collapsed"
      :panel-layer-title="title"
      :panel-layer-id="layerId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LayerControlList from './LayerControlList'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    layerId: {
      type: Number,
      required: false
    }
  },
  data: () => ({
    collapsed: false
  }),
  computed: {
    ...mapState([
      'activeLayerSetId'
    ]),
    layerControlListIsVisible () {
      if (!this.activeLayerSetId || !this.layerId) {
        return true
      }

      return Number(this.activeLayerSetId) === Number(this.layerId)
    }
  },
  watch: {
    layerControlListIsVisible (visible) {
      this.collapsed = !visible
    }
  },
  methods: {
    setActiveLayer () {
      this.$store.commit('setActiveLayerSetId', this.layerId)
      this.$store.commit('setSelectedLayerId', this.layers[0].id)
    },
    toggleCollapse () {
      this.collapsed = !this.collapsed

      if (this.collapsed) {
        this.setActiveLayer()
      }
    }
  },
  components: {
    LayerControlList
  }
}
</script>

<style>
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
