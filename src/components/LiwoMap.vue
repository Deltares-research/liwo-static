<template>
  <l-map
    id="liwo-map"
    ref="map"
    :zoom="zoom"
    :maxZoom="maxZoom"
    :minZoom="minZoom"
    :center="center"
    :crs="crs"
    :continuousWorld="continuousWorld"
  >
    <l-tile-layer
      :options="{ tms }"
      :url="url"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :continuousWorld="continuousWorld"
      :attribution="attribution"
    />
    <base-layer-control
      :tileLayers="tileLayers"
      @baselayer="updateBaseLayer"
    />
    <liwo-map-layers :layers="items" /> 
  </l-map>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'proj4leaflet'

import BaseLayerControl from './BaseLayerControl'
import LiwoMapLayers from './LiwoMapLayers'

import mapConfig from '../map.config'

export default {
  props: [ 'items' ],
  components: { BaseLayerControl, LiwoMapLayers, LMap, LTileLayer },
  data () {
    return {
      continuousWorld: true,
      crs: this.createCrs(),
      zoom: mapConfig.zoom,
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
      center: L.latLng(...mapConfig.center),
      tms: mapConfig.tms,
      attribution: mapConfig.attribution,
      tileLayers: mapConfig.tileLayers,
      url: mapConfig.tileLayers[0].url
    }
  },
  methods: {
    createCrs () {
      return new L.Proj.CRS(mapConfig.crsType, mapConfig.proj, {
        resolutions: mapConfig.resolutions,
        bounds: L.bounds(mapConfig.bounds),
        origin: mapConfig.origin
      })
    },
    updateBaseLayer (url) {
      this.url = url
    }
  }
}
</script>

<style>

#liwo-map {
  width: calc(100% - 2rem);
  height: 400px;
  display: block;
  margin: 0 auto;
  margin-top: 1rem;
}
</style>
