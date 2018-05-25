<template>
  <span>
    <template
      v-for="layer in expandedMapLayers"
    >
      <l-geo-json
        v-if="layer.type === 'json'"
        :ref="layer.layer"
        :key="layer.layer"
        :geojson="layer.geojson"
        :options="{ style: (feature) => setStyle(feature, layer) , onEachFeature: onEachFeature }"
      />
      <l-wms-tile-layer
        v-else
        layer-type="base"
        format="image/png"
        :ref="layer.layer"
        :key="layer.layer"
        :base-url="geoServerURL(layer.namespace)"
        :layers="layer.layer"
        :styles="layer.style"
        :transparent="true"
        :opacity="layer.opacity"
      />
    </template>
  </span>
</template>

<script>
import { LGeoJson, LWMSTileLayer as LWmsTileLayer } from 'vue2-leaflet'

import BreachTooltip from './BreachTooltip'
import DikeRingTooltip from './DikeRingTooltip'

import mapConfig from '../map.config.js'
import loadGeojson from '../lib/load-geojson'
import renderVue from '../lib/render-vue'

const MARKER_IDENTIFIER = 'Point'

const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL
const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL

export default {
  data () {
    return {
    }
  },
  props: {
    layerGroups: Array,
    mapRef: Object
  },
  methods: {
    geoServerURL (namespace) {
      return namespace === 'LIWO_Operationeel'
        ? DYNAMIC_GEOSERVER_URL
        : STATIC_GEOSERVER_URL
    }
  },
  watch: {
    selectedDikeRing (newDikeRingId, oldDikeRingId) {
      const map = this.mapRef.mapObject

      if (newDikeRingId === oldDikeRingId) {
        return
      }

      if (oldDikeRingId) {
        const oldDikeRing = this.dikeRings[oldDikeRingId]
        const { beheerder, dijkring } = oldDikeRing.feature.properties

        const tooltip = renderVue(DikeRingTooltip, {
          admin: beheerder,
          title: dijkring
        })

        oldDikeRing.bindTooltip(tooltip)
        this.breaches[oldDikeRingId].forEach(breach => {
          map.removeLayer(breach)
        })
      }

      this.dikeRings[newDikeRingId].unbindTooltip()
      this.breaches[newDikeRingId].forEach(breach => {
        map.addLayer(breach)
      })
    },
    mapLayers (mapLayers, oldMapLayers) {
      // this code keeps the maplayers in sync between the mapLayers object (a tree of map layers) with layers that are actually shown on the map

      // if a layer is removed we need to throw away its reference
      // let's check which layers were removed
      // TODO: check this, it gives errors on page changes.

      const removedLayers = oldMapLayers.filter(
        oldLayer => mapLayers.every(
          mapLayer => mapLayer.layer !== oldLayer.layer
        )
      )

      removedLayers.forEach(layer => {
        // When used on elements/components with v-for,
        // the registered reference will be an Array containing DOM nodes or component instances.
        // https://vuejs.org/v2/api/#ref
        this.$refs[layer.layer][0].mapObject.remove()
      })

      // If mapLayers is updated we need to update the geojson data
      // TODO: get rid of this data here, move to loadlayersets
      Promise.all(
        // wait for all map layers to be updated
        mapLayers.map(async (layer) => {
          let result = layer
          if (layer.type === 'json') {
            result.geojson = await loadGeojson(layer)
          }
          return result
        })
      )
      // and after all layers are updated set them to the current object
        .then(layers => {
          // TODO: what is the difference between mapLayers and exapandedMapLayers, get rid of the expandedMapLayers
          this.expandedMapLayers = layers
        })
    }
  },
  components: {
    LGeoJson,
    LWmsTileLayer
  }
}
</script>

<style>
.LIWO_Tools_Dreigingsbeelden_Dijkringen {
  stroke: rgb(34, 34, 34);
  stroke-opacity: 0.6;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: rgb(208, 214, 220);
  fill-opacity: 0.3;
  /* for lakes  */
  fill-rule: evenodd;
}

.LIWO_Tools_Dreigingsbeelden_Dijkringen:hover {
  stroke-opacity: 0.7;
  fill-opacity: 0.0;
}
</style>
