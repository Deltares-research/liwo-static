<template>
  <div class="viewer">
    <liwo-map-dir
      :layers="activeLayerSet"
    />
    <layer-panel
      :layerSets="panelLayerSets"
      @open-export="showExport = true"
    />
    <legend-panel
      v-if="selectedVisibleLayerLegend"
      :caption="selectedVisibleLayerLegend.title"
      :namespace="selectedVisibleLayerLegend.namespace"
      :layer-name="selectedVisibleLayerLegend.layer"
      :style-name="selectedVisibleLayerLegend.style"
    />
    <export-popup
      v-if="showExport"
      @close="showExport = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMapDir from '@/components/LiwoMapDir'
import LegendPanel from '@/components/LegendPanel'

import { loadLayersetById } from '@/lib/load-layersets'

export default {
  data () {
    return {
      layers: [],
      parsedLayers: [],
      id: 0,
      showExport: false,
      title: ''
    }
  },
  async mounted () {
    const mapId = Number(this.$route.params.id)

    this.$store.commit('setMapId', mapId)
    this.$store.dispatch('loadLayerSetsById', mapId)

    const layerSet = await loadLayersetById(mapId)

    this.layers = layerSet.layers
    this.title = layerSet.title
    this.id = layerSet.id
  },
  computed: {
    ...mapState({
      variantIndexForSelectedLayer: (state) => state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }),
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds',
      'selectedBreaches'
    ]),
    ...mapGetters([
      'activeLayerSet',
      'currentLayerSet',
      'panelLayerSets'
    ]),
    selectedLayer () {
      if (!this.currentLayerSet ) {
        return
      }

      const selectedLayers = this.currentLayerSet.layers
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        return selectedLayers[0] // should only be one
      }
    },
    selectedVisibleLayerLegend () {
      if (this.selectedLayer && this.visibleLayerIds.some(visibleId => visibleId === this.selectedLayerId)) {
        return {
          ...this.selectedLayer.legend,
          layerType: this.selectedLayer.variants[0].type
        }
      }
      return undefined
    },
    variantTitlesForSelectedLayer () {
      return (this.selectedLayer)
        ? this.selectedLayer.variants.map(({title}) => title)
        : []
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    }
  },
  watch: {
    layers (layers) {
      if (layers.length === 0) {
        return
      }
      // new layers mean new state init
      this.$store.commit('setSelectedLayerId', layers[0].id)

      layers.forEach(layer => {
        this.$store.commit('showLayerById', layer.id)
        this.$store.commit('setVisibleVariantIndexForLayerId', {index: 0, layerId: layer.id})
      })
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMapDir,
  }
}
</script>

<style>
@import '../components/variables.css';

.viewer {
  position: relative;
}
.viewer .layer-panel {
  position: absolute;
  top: 1rem;
  left: 2rem;
  z-index: 1000;
  box-shadow: var(--shadow);
}

.viewer .segmented-buttons {
  position: absolute;
  width: 100%;
  bottom: -1rem;
  z-index: 1000;
}

.viewer .legend-panel {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  box-shadow: var(--shadow);
}

</style>
