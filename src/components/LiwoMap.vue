<template>
  <l-map
    id="liwo-map"
    ref="liwoMap"
    :zoom="zoom"
    :max-zoom="maxZoom"
    :min-zoom="minZoom"
    :center="center"
    :zoom-control="false"
    :crs="crs"
    :continuous-world="continuousWorld"
    >
    <l-control-zoom></l-control-zoom>
    <l-tile-layer
      :options="{ tms: baseLayer.tms }"
      :url="baseLayer.url"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :continuous-world="continuousWorld"
      :attribution="attribution"
    />
    <base-layer-control
      :tile-layers="baseLayer.tileLayers"
      @baselayer="updateBaseLayer"
    />
    <liwo-map-layers :map-layers="mapLayers" :map-ref="mapRef" />
  </l-map>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { LMap, LTileLayer, LControlZoom } from 'vue2-leaflet'
import 'proj4leaflet'

import BaseLayerControl from './BaseLayerControl'
import LiwoMapLayers from './LiwoMapLayers'

import '../lib/leaflet-hack'
import mapConfig from '../map.config.js'
import rdConfig from '../lib/rijksdriehoek.config.js'

export default {
  props: {
    // just pass along, deal with the structure in LiwoMapLayers
    mapLayers: Array
  },
  components: { BaseLayerControl, LiwoMapLayers, LMap, LControlZoom, LTileLayer },
  data () {
    return {
      mapRef: undefined,
      continuousWorld: true,
      crs: this.createCrs(),
      zoom: mapConfig.zoom,
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
      center: L.latLng(...mapConfig.center),
      attribution: mapConfig.attribution,
      baseLayer: {
        tms: mapConfig.tileLayers[0].tms,
        tileLayers: mapConfig.tileLayers,
        url: mapConfig.tileLayers[0].url
      }
    }
  },
  methods: {
    createCrs () {
      return new L.Proj.CRS(rdConfig.crsType, rdConfig.proj, {
        resolutions: rdConfig.resolutions,
        bounds: L.bounds(rdConfig.bounds),
        origin: rdConfig.origin
      })
    },
    updateBaseLayer (url) {
      this.baseLayer.url = url
    }
  },
  mounted () {
    this.mapRef = this.$refs.liwoMap
  }
}
</script>

<style>
#liwo-map {
  width: calc(100% - 2rem);
  display: block;
  margin: 0 auto;
  margin-top: 1rem;
  height: calc(100vh - 20rem);
}
</style>
