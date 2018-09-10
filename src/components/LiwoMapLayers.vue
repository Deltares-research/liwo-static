4<template>
  <span>
    <template
      v-for="layer in expandedMapLayers"
    >
      <l-geo-json
        v-if="layer.type === 'json'"
        :ref="layer.layer"
        :key="layer.layer"
        :geojson="layer.geojson"
        :options="{ style: (feature) => setStyle(feature, layer) , onEachFeature: onEachFeature  }"
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
        :opacity="opacityByLayerId[layer.id] ? opacityByLayerId[layer.id] : 1"
        :transparent="true"
      />
    </template>
  </span>
</template>

<script>
import { mapState } from 'vuex'
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
      expandedMapLayers: [],
      dikeRings: {},
      breaches: {},
      selectedDikeRing: undefined
    }
  },
  props: {
    mapLayers: Array,
    mapRef: Object
  },
  computed: {
    ...mapState([
      'opacityByLayerId'
    ])
  },
  methods: {
    geoServerURL (namespace) {
      return namespace === 'LIWO_Operationeel'
        ? DYNAMIC_GEOSERVER_URL
        : STATIC_GEOSERVER_URL
    },
    onEachFeature (feature, layer) {
      const dijkringnr = layer.feature.properties.dijkringnr
      const map = this.mapRef.mapObject

      if (feature.geometry.type === MARKER_IDENTIFIER && dijkringnr !== this.selectedDikeRing) {
        this.breaches[dijkringnr]
          ? this.breaches[dijkringnr] = [ ...this.breaches[dijkringnr], layer ]
          : this.breaches[dijkringnr] = [ layer ]

        const tooltip = renderVue(BreachTooltip, { title: layer.feature.properties.naam })
        layer.bindTooltip(tooltip)

        layer.once('add', () => map.removeLayer(layer))
      }

      if (feature.geometry.type !== MARKER_IDENTIFIER) {
        this.dikeRings[dijkringnr] = layer

        const { beheerder, dijkring } = layer.feature.properties
        const tooltip = renderVue(DikeRingTooltip, { admin: beheerder, title: dijkring })
        layer.bindTooltip(tooltip)

        layer.on('click', () => {
          map.fitBounds(layer.getBounds())
          this.selectedDikeRing = dijkringnr
          this.breaches[dijkringnr].forEach(breach => {
            map.addLayer(breach)
          })
        })
      }
    },
    setStyle (feature, layer) {
      // set the layer to to style object and use css for styling
      return { className: layer.style }
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
      const refs = this.$refs
      const removedLayers = oldMapLayers
        .filter(oldLayer => mapLayers.every(mapLayer => mapLayer.layer !== oldLayer.layer))

      removedLayers.forEach(layer => {
        // When used on elements/components with v-for,
        // the registered reference will be an Array containing DOM nodes or component instances.
        // https://vuejs.org/v2/api/#ref
        refs[layer.layer][0].mapObject.remove()
      })
      Promise.all(mapLayers.map(async (layer) => {
        return (layer.type === 'json')
          ? { ...layer, geojson: await loadGeojson(layer) }
          : layer
      }))
        .then(layers => {
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
