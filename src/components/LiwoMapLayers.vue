<template>
  <span>
    <template
      v-for="layer in layerSet"
    >
      <l-geo-json
        v-if="layer.type === 'json'"
        :geojson="layer.geojson"
        :key="layer.id"
      />
      <l-wms-tile-layer
        v-else
        layer-type="base"
        format="image/png"
        :key="layer.id"
        :base-url="geoServerURL(layer.namespace)"
        :layers="layer.layer"
        :styles="layer.style"
        :transparent="true"
      />
    </template>
  </span>
</template>

<script>
import { LGeoJson, LWMSTileLayer } from 'vue2-leaflet'

const STATIC_GEOSERVER_URL = 'https://geodata.basisinformatie-overstromingen.nl/geoserver/ows/'
const DYNAMIC_GEOSERVER_URL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/'

export default {
  props: [ 'layerSet' ],
  components: {
    LGeoJson,
    // WMS is always in caps (acronym) and custom-elements in html are lowercase
    'l-wms-tile-layer': LWMSTileLayer
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
