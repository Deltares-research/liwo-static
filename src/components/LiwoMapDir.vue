<template>
  <div
    ref="liwoMap"
    class="liwo-map"
    v-leaflet="{
      callbacks: { breachCallBack },
      config: initialConfig,
      mapLayers: Object.freeze(expandedMapLayers)
    }"
  ></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
      zoomControl: false,
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
      'opacityByLayerId',
      'selectedBreaches',
    ]),
    ...mapGetters([
      'parsedLayerSet'
    ])
  },
  methods: {
    breachCallBack ({ target }) {
      const { id, naam: breachName, layerType } = target.feature.properties

      this.$store.dispatch('addBreach', { id, breachName, layerType })
    },
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
      if (!parsedLayerSet) {
        return []
      }

      parsedLayerSet
        .then(layers => {
          if (layers.length) {
            this.expandedMapLayers = layers
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
  fill-opacity: 0;
  /* for lakes  */
  fill-rule: evenodd;
}
</style>
