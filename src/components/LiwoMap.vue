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
      :options="{style: feature => setStyle(feature, layer), onEachFeature: feature => onEachFeature(feature, layer)}"
      :geojson="layer.geojson"
      :key="layer.id"
      :ref="layer.id"
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
    <liwo-map-layers :layerSet="layerSet" />
  </l-map>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import Vue from 'vue'
import L from 'leaflet'
import { LMap, LTileLayer, LGeoJson, LPopup } from 'vue2-leaflet'
import 'proj4leaflet'

import rijksdriehoek from '../lib/rijksdriehoek.js'
import BaseLayerControl from './BaseLayerControl'
import LiwoMapLayers from './LiwoMapLayers'

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
  components: { BaseLayerControl, LMap, LiwoMapLayers, LTileLayer, LGeoJson, LPopup },
  props: ['layerSet'],
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
        tms: mapConfig.tileLayers[0].tms,
        tileLayers: mapConfig.tileLayers,
        url: mapConfig.tileLayers[0].url
      }
    }
  },
  mounted () {
  },
  methods: {
    onEachFeature (feature, layer) {
      const parent = this.$refs[layer.id]
      const Popup = Vue.extend(LPopup)
      const popup = new Popup()
      const result = popup.$mount()
      console.log('result', result)
      parent.mapObject.bindPopup(result.$el)
    },

    setStyle (feature, layer) {
      // set the layer to to style object and use css for styling
      return {className: layer.style}
    },
    createCrs () {
      // Create the Coordinate Reference System
      // note that this is explictly created. Sharing this object between layers
      // gives problems
      return new L.Proj.CRS(rijksdriehoek.crsType, rijksdriehoek.proj, {
        resolutions: rijksdriehoek.resolutions,
        bounds: L.bounds(rijksdriehoek.bounds),
        origin: rijksdriehoek.origin
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
