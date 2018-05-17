<template>
  <span>
    <template
      v-for="layer in mapLayers"
    >
      <l-geo-json
        v-if="layer.type === 'json'"
        :geojson="layer.geojson"
        :key="layer.id"
      />
      <l-wms-tile-layer
        v-else
        layerType="base"
        format="image/png"
        :key="layer.id"
        :baseUrl="geoServerURL(layer.namespace)"
        :layers="layer.layer"
        :styles="layer.style"
        :transparent="true"
      />
    </template>
  </span>
</template>

<script>
import { LGeoJson, LWMSTileLayer as LWmsTileLayer } from 'vue2-leaflet'

const STATIC_GEOSERVER_URL = 'https://geodata.basisinformatie-overstromingen.nl/geoserver/ows/'
const DYNAMIC_GEOSERVER_URL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/'

export default {
  props: {
    mapLayers: Array
  },
  components: {
    LGeoJson,
    LWmsTileLayer
  },
  methods: {
    tileType (type) {
      return type === 'json'
        ? 'l-geo-json'
        : 'l-wms-tile-layer'
    },
    geoServerURL (namespace) {
      return namespace === 'LIWO_Operationeel'
        ? DYNAMIC_GEOSERVER_URL
        : STATIC_GEOSERVER_URL
    }
  }
}
</script>
