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
    <l-geo-json
      v-for="layer in layers"
      v-if="layer.type === 'json'"
      :options="layer.options"
      :geojson="layer.geojson"
      :style="layer.style"
      :key="layer.id"
      >
    </l-geo-json>
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

import Vue from 'vue'
import L from 'leaflet'
import _ from 'lodash'
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
import 'proj4leaflet'

import BaseLayerControl from './BaseLayerControl'

import mapConfig from '../map.config'

// as discussed in https://github.com/Leaflet/Leaflet/issues/4968
// replace default icons by requires
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  components: { BaseLayerControl, LMap, LTileLayer, LGeoJson },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
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
  mounted () {
    Vue.set(this, 'layers', this.getLayers())
  },
  methods: {
    getLayers () {
      let layers = []
      this.items.forEach(item => {
        let obj = {
          properties: {
            ...item
          }
        }
        item.variants.forEach(async variant => {
          _.assign(obj.properties, variant)
          _.assign(obj, variant.map)
          obj.id = obj.properties.id
          let url = 'https://geodata.basisinformatie-overstromingen.nl/geoserver/ows'
          let request = {
            isActive: true,
            service: 'WFS',
            version: '1.0.0',
            request: 'getFeature',
            typeName: `${obj.namespace}:${obj.layer}`,
            outputFormat: 'application/json',
            srsName: 'EPSG:28992',
            maxFeatures: 2000
          }
          let params = new URLSearchParams(request).toString()
          let urlWithParams = url + '?' + params
          if (obj.type === 'json') {
            obj.geojson = await fetch(urlWithParams, {mode: 'cors'})
              .then(resp => resp.json())
              .catch(error => console.log('Error:', error, obj))
            layers.push(obj)
          } else if (obj.type === 'WMS') {
            layers.push(obj)
          }
        })
      })
      return layers
    },
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
