<template>
  <l-map
    id="liwo-map"
    :zoom="zoom"
    :maxZoom="maxZoom"
    :minZoom="minZoom"
    :center="center"
    :crs="crs"
    ref="map"
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
  </l-map>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'proj4leaflet'

import mapConfig from '../map.config'


export default {
  components: { LMap, LTileLayer },
  data: function () {
    return {
      continuousWorld: true,
      crs: this.createRD(),
      zoom: 3,
      maxZoom: 13,
      minZoom: 2,
      center: L.latLng(...mapConfig.center),
      tms: true,
      attribution: mapConfig.attribution,
      url: mapConfig.url
    }
  },
  methods: {
    createRD () {
      const RD = new L.Proj.CRS(mapConfig.crsType, mapConfig.proj, {
        resolutions: mapConfig.resolutions,
        bounds: L.bounds(mapConfig.bounds),
        origin: mapConfig.origin
      })

      RD.scale = (zoom) => 1 / mapConfig.resolutions[zoom]

      return RD
    }
  }
}
</script>

<style>

#liwo-map {
  width: calc(100% - 2rem);
  height: 400px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
