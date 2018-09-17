<template>
  <div
    ref="liwoMap"
    class="liwo-map"
    v-leaflet="{ config: initialConfig, mapLayers: expandedMapLayers }"
  ></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

import { mapState, mapGetters } from 'vuex'

import '../lib/leaflet-hack'
import mapConfig from '../map.config.js'
import rdConfig from '../lib/rijksdriehoek.config.js'

export default {
  data () {
    return {
      expandedMapLayers: undefined
    }
  },
  created () {
    this.initialConfig = {
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
  mounted () {
    this.mapRef = this.$refs.liwoMap
    // remove default zoom
    // this.mapRef.mapObject.zoomControl.remove()
  },
  computed: {
    ...mapState([
      'opacityByLayerId'
    ]),
    ...mapGetters([
      'parsedLayerSet'
    ])
  },
  methods: {
    createCrs () {
      return new L.Proj.CRS(rdConfig.crsType, rdConfig.proj, {
        resolutions: rdConfig.resolutions,
        bounds: L.bounds(rdConfig.bounds),
        origin: rdConfig.origin
      })
    }
  },
  watch: {
    parsedLayerSet (parsedLayerSet) {
      parsedLayerSet
        .then(layers => {
          if (layers.length) {
            this.expandedMapLayers = Object.freeze(layers)
          }
        })
    }
  }
}
</script>

<style>
.liwo-map {
  width: calc(100% - 2rem);
  display: block;
  margin: 0 auto;
  margin-top: 1rem;
  height: calc(100vh - 20rem);
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
