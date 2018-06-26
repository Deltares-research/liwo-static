<template>
  <div class="viewer">
    <liwo-map
      :map="map"
    />
    <layer-panel
      :layer-groups="map.layerGroups"
      @open-export="showExport = true"
    />
    <legend-panel
      v-if="selectedLayerGroup"
      :caption="'caption'"
      :layer-name="selectedLayerGroup.name"
      :style-name="selectedLayerGroup.style"
    />
    <segmented-buttons
      v-if="variants.length > 1"
      :items="variants"
      :active-index="selectedVariantIndex"
      @click="selectVariant"
    />
    <export-popup
      v-if="showExport"
      @close="showExport = false"
    />
  </div>
</template>

<script>
import _ from 'lodash'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import SegmentedButtons from '@/components/SegmentedButtons'

import '@/lib/leaflet-hack'
import { loadMapById } from '@/lib/load-layersets'

export default {
  data () {
    return {
      map: {layerGroups: [], properties: {}},
      showExport: false,
      title: ''
    }
  },
  async mounted () {
    const map = await loadMapById(this.$route.params.id)
    this.map = map
  },
  computed: {
    selectedLayerGroup () {
      return _.first(
        this.map.layerGroups
          .filter(({ id }) => this.$store.state.selectedLayerGroupId === id)
      )
    },
    variants () {
      return []
    }
  },
  methods: {
  },
  watch: {
    map (map) {
      if (map.layerGroups.length === 0) {
        return
      }
      // new layers mean new state init
      this.$store.commit('setSelectedLayerGroupId', _.first(map.layerGroups).id)
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    SegmentedButtons
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
