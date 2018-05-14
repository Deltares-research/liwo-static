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
        v-if="layer.type === 'json'"
        :options="layer.options"
        :geojson="layer.geojson"
        :style="layer.style"
        :key="layer.id"
        ></l-geo-json>
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

// as discussed in https://github.com/Leaflet/Leaflet/issues/4968
// replace default icons by requires
L.Icon.Default.imagePath = ''
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

import L from 'leaflet'
import _ from 'lodash'
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
import 'proj4leaflet'

import BaseLayerControl from './BaseLayerControl'

import mapConfig from '../map.config'

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
      baseLayer: {
        tms: mapConfig.tms,
        tileLayers: mapConfig.tileLayers,
        url: mapConfig.tileLayers[0].url
      }
    }
  },
  computed: {
    layers () {
      let layers = []
      this.items.forEach(item => {
        let obj = {
          properties: {
            ...item
          }
        }
        item.variants.forEach(variant => {
          _.assign(obj.properties, variant)
          _.assign(obj, variant.map)
          obj.geojson = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [4, 52]
            },
            "properties": {
              "name": "Dinagat Islands"
            }
          }
          console.log('obj', obj)
          layers.push(obj)
        })

      })
      return layers
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
