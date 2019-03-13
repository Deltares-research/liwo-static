<template>
  <div class="viewer" :class="{'viewer--has-notificaton': currentNotifications.length}">
    <div class="viewer__map-wrapper">
      <liwo-map
        :layers="activeLayerSet"
        @initMap="setMapObject"
      />
      <notification-bar
        v-for="{type, message, id} in currentNotifications"
        :key="id"
        :type="type"
        :message="message"
      />
      <layer-panel
        :layerSets="panelLayerSets"
        @open-export="showExport = true"
      />
      <legend-panel
        v-if="visibleLayerLegend"
        :caption="visibleLayerLegend.title"
        :namespace="visibleLayerLegend.namespace"
        :layer-name="visibleLayerLegend.layer"
        :style-name="visibleLayerLegend.style"
      />
      <export-popup
        v-if="showExport"
        :map-object="mapObject"
        :map-layers="activeLayerSet"
        @close="showExport = false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import ExportPopup from '@/components/ExportPopup'
import LayerPanel from '@/components/LayerPanel'
import LiwoMap from '@/components/LiwoMap'
import LegendPanel from '@/components/LegendPanel'
import NotificationBar from '@/components/NotificationBar.vue'

const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'

export default {
  data () {
    return {
      parsedLayers: [],
      id: 0,
      showExport: false
    }
  },
  async mounted () {
    const mapId = Number(this.$route.params.id)

    this.$store.commit('setMapId', mapId)
    this.$store.dispatch('loadLayerSetsById', { id: mapId, initializeMap: true })
    this.$store.commit('setPageTitle', PAGE_TITLE)
  },
  computed: {
    ...mapState({
      variantIndexForSelectedLayer: (state) => state.visibleVariantIndexByLayerId[this.selectedLayerId]
    }),
    ...mapState([
      'selectedLayerId',
      'visibleLayerIds'
    ]),
    ...mapGetters([
      'activeLayerSet',
      'panelLayerSets',
      'currentNotifications'
    ]),
    selectedLayer () {
      if (!this.panelLayerSets) {
        return
      }

      const selectedLayers = this.panelLayerSets
        .map((layerSet) => layerSet.layers)
        .reduce((allLayers, layers) => [ ...allLayers, ...layers ], [])
        .filter(({ id }) => this.selectedLayerId === id)

      if (selectedLayers && selectedLayers[0]) {
        // should only be one
        return selectedLayers[0]
      }
    },
    visibleLayerLegend () {
      if (!this.selectedLayer) {
        return undefined
      }

      return {
        ...this.selectedLayer.legend,
        layerType: this.selectedLayer.variants[0].type
      }
    }
  },
  methods: {
    setVisibleVariantIdForSelectedlayer (index) {
      this.$store.commit('setVisibleVariantIndexForLayerId', { index, layerId: this.selectedLayerId })
    },
    setMapObject (mapObject) {
      this.mapObject = mapObject
      console.log('CRS', mapObject.options.crs.scale())
    }
  },
  components: {
    ExportPopup,
    LayerPanel,
    LegendPanel,
    LiwoMap,
    NotificationBar
  }
}
</script>

<style>
  @import '../components/variables.css';

  .viewer {
    position: relative;
    padding-top: 1rem;
  }

  .viewer__map-wrapper {
    position: relative;
  }

  .viewer .notification-bar {
    position: absolute;
    top: 1rem;
    z-index: 1000;
    left: 368px;
    box-shadow: var(--shadow);

    /* 100px: 5 * 20px margin, 320px LayerPanel width, 44px map controls width */
    width: calc(100% - 100px - 320px - 44px);
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
