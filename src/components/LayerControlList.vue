<template>
  <ul class="layer-control-list layer-control-list--active">
    <!-- <li class="layer-control-list__item"> -->
    <!--   <layer-control -->
    <!--     :active="(panelLayerId === selectedLayerId)" -->
    <!--     :id="panelLayerId" -->
    <!--     :variants="[]" -->
    <!--     :layerType="''" -->
    <!--     :visible="activeMarkerLayerIsVisible" -->
    <!--     :isMarkerLayer="true" -->
    <!--     :title="LOCATION" -->
    <!--     @toggle="toggleActiveMarker" -->
    <!--   /> -->
    <!-- </li> -->
    <li
      class="layer-control-list__item"
      v-for="(layer, index) in layers"
      :key="layer.id"
      @click="setActive(layer, index)"
    >
      <layer-control
        :id="layer.id"
        :active="layer.properties.active"
        :title="layer.properties.title"
        :metadata="layerMetaData(layer)"
        :variants="layer.variants || []"
        :layerType="layer.legend.layer"
        :layer.sync="layer"
        :visible="layerIsVisible(layer.id)"
        @toggle="toggleLayerVisibilityById"
        @changeOpacity="setLayerOpacity"
        @selectVariant="setVisibleVariant"
        @selectActiveLayer="setSelectedLayerId"
      />
    </li>
  </ul>
</template>

<script>

import _ from 'lodash'

import { mapState } from 'vuex'

import LayerControl from './LayerControl'

const LOCATION = 'Locatie'

export default {
  props: {
    layers: {
      type: Array,
      requred: true
    }
  },
  data () {
    return {
      LOCATION
    }
  },
  computed: {
    ...mapState([
      'selectedLayerId',
      'panelLayerId',
      'visibleLayerIds',
      'visibleVariantIndexByLayerId',
      'hidden',
      'hiddenLayers'
    ]),
    activeMarkerLayerIsVisible () {
      return !this.hiddenLayers.includes(this.panelLayerId)
    }
  },
  methods: {
    setActive (layer, index) {
      let layers = _.clone(this.layers)
      // set to inactive
      _.each(layers, (layer) => { layer.properties.active = false })
      // set our layer to active
      layer.properties.active = true
      // store it in the proper location
      layers[index] = layer
      // emit update
      this.$emit('update:layers', layers)
      console.log('activate', layer, index)
    },
    layerMetaData ({ id, variants }) {
      const index = this.visibleVariantIndexByLayerId[id]
      return typeof index !== 'undefined'
        ? variants[index].metadata
        : variants[0].metadata
    },
    layerIsVisible (id) {
      return this.visibleLayerIds.indexOf(id) !== -1
    },
    setSelectedLayerId (id) {
      this.$store.commit('setSelectedLayerId', id)
    },
    setLayerOpacity ({ layerId, opacity }) {
      this.$store.commit('setOpacityByLayerId', {
        layerId,
        opacity
      })
    },
    toggleLayerVisibilityById (id) {
      this.$store.commit('toggleLayerById', id)
    },
    setVisibleVariant ({ layerId, variantIndex }) {
      this.layers.forEach(layer => {
        this.$store.commit('setVisibleVariantIndexForLayerId', { layerId: layer.id, index: variantIndex })
      })
    },
    toggleActiveMarker (id) {
      this.$store.commit('toggleActiveMarker', id)
    }
  },
  mounted () {
    this.$store.commit('toggleLayerById', this.panelLayerId)
  },
  components: {
    LayerControl
  }
}
</script>

<style>
  .layer-control-list {
    background-color: white;
    height: 0;
    overflow: hidden;
  }

  .layer-control-list--active {
    height: auto;
  }

  .layer-control-list__item {
    border-bottom: 1px solid var(--light-gray)
  }
</style>
