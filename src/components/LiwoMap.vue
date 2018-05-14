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
    <template v-for="layer in layers" >
      <l-geo-json
        v-if="layer.type === 'geojson'"
        :options="layer.options"
        :geojson="layer.geojson"
        :style="layer.style"
        :key="layer.id"
        ></l-geo-json>

      <l-tile-layer
        v-if="layer.type === 'wms'"
        :key="layer.id"></l-tile-layer>
    </template>

    <l-tile-layer
      :options="{ tms: baseLayer.tms }"
      :url="baseLayer.url"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :continuousWorld="continuousWorld"
      :attribution="baseLayer.attribution"
    />
    <base-layer-control
      :tileLayers="baseLayer.tileLayers"
      @baselayer="updateBaseLayer"
    />
  </l-map>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'proj4leaflet'

import BaseLayerControl from './BaseLayerControl'

import mapConfig from '../map.config'

export default {
  components: { BaseLayerControl, LMap, LTileLayer },
  data () {
    return {
      zoom: mapConfig.zoom,
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
      attribution: mapConfig.attribution,
      center: L.latLng(...mapConfig.center),
      crs: this.createCrs(),
      continuousWorld: true,
      layers: [],
      baseLayer: {
        tms: mapConfig.tms,
        tileLayers: mapConfig.tileLayers,
        url: mapConfig.tileLayers[0].url
      }
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
      this.baseLayer.url = url
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
