<template>
  <span>
    <l-wms-tile-layer
      layerType="base"
      v-for="layer in layers" 
      :key="layer.id" 
      :baseUrl="geoServerURL"
      :layers="layer.layers" 
      :visible="layer.visible" 
      :name="layer.name"    
    />
  </span>
</template>

<script>
import { LWMSTileLayer } from 'vue2-leaflet'

const STATIC_GEOSERVER_URL = 'https://tl-396.xtr.deltares.nl:8080/geoserver/'
const DYNAMIC_GEOSERVER_URL = 'https://tl-397.xtr.deltares.nl:8080/geoserver/'

export default {
  props: [ 'layers' ],
  components: {
    LWMSTileLayer
  },
  mounted () {
    console.log('ITEMS', this.$props.layers)
  },
  computed: {
    geoServerURL (namespace) {
        return namespace === "LIWO_Operationeel" 
          ? DYNAMIC_GEOSERVER_URL 
          : STATIC_GEOSERVER_URL
    }
  }
}
</script>
