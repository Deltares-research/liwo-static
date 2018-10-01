<template>
  <div class="layerpanel-item">
    <h3
      class="layerpanel-item__title"
      v-if="title"
      @click="setActiveLayer"
    >
      {{ title }}
    </h3>
    <layer-control-list :layers="layers" :visible="layerControlListIsVisible" />
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
  methods: {
    setActiveLayer () {
      this.$store.commit('setActiveLayerSetId', this.layerId)
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
    line-height: 44px;
    font-size: 1.2em;
    color: var(--black);
    margin-bottom: 0;
  }
</style>
