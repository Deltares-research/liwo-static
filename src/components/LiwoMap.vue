<template>
  <div>
    <div
      ref="liwoMap"
      class="liwo-map"
      @marker:mouseover="$emit('marker:mouseover', $event)"
      v-leaflet="{
        callbacks: { onClick, initMapObject },
        config: mapConfig,
        layers: layers,
        cluster: clusterMarkers,
      }"
      v-test="'map'"
    >
      <div ref="legend">
        <slot name="legend"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import createMapConfig from '@/lib/leaflet-utils/mapconfig-factory'
import { legendControl } from '@/lib/leaflet-utils/legend'
import { EPSG_28992 } from '@/lib/leaflet-utils/projections'

// TODO: replace v-leaflet directive with vue2-leaflet package...
export default {
  props: {
    projection: {
      type: String,
      default: EPSG_28992
    },
    layers: {
      type: Array,
      required: true
    },
    clusterMarkers: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      map: null
    }
  },
  watch: {
    '$route.query' () {
      if (this.map) {
        this.setPosition()
      }
    }
  },
  created () {
    this.mapConfig = createMapConfig({
      projection: this.projection
    })
  },
  mounted () {
    this.mapRef = this.$refs.liwoMap
    this.$on('browser-print-start', (evt) => {
      const control = legendControl({ position: 'bottomright', el: this.$refs.legend })
      control.addTo(evt.printMap)
    })
  },
  beforeDestroy () {
    this.removePositionListeners()
  },
  methods: {
    onClick (event) {
      // TODO: click on what
      this.$emit('click', event)
    },
    initMapObject (mapObject) {
      this.map = mapObject
      this.$emit('initMap', mapObject)
      // pass along click to map objects
      mapObject.on('click', event => {
        // pass the  map click event on up
        this.$emit('map:click', event)
      })

      window.liwoMap = mapObject

      this.setPosition()
      this.addPositionListeners()
    },
    setPosition () {
      const { zoom, center } = this.$route.query

      if (zoom) {
        this.map.setZoom(zoom, {
          animate: false,
          noMoveStart: true
        })
      }

      if (center) {
        const [lat, lng] = center.split(',')

        this.map.panTo(new window.L.LatLng(lat, lng), {
          animate: false,
          noMoveStart: true
        })
      }
    },
    addPositionToRoute () {
      const { lat, lng } = this.map.getCenter()
      const zoom = this.map.getZoom()
      const center = `${lat.toFixed(5)},${lng.toFixed(5)}`

      if (this.$route.query.center === center && this.$route.query.zoom.toString() === zoom.toString()) {
        /* location did not change, we're done */
        return
      }

      this.$router.replace({
        ...this.$route,
        query: {
          ...this.$route.query,
          center: center,
          zoom
        }
      })
    },
    addPositionListeners () {
      this.map.on('moveend', this.addPositionToRoute)
    },
    removePositionListeners () {
      this.map.off('moveend', this.addPositionToRoute)
    }
  }
}
</script>

<style>
  .liwo-map {
    width: calc(100% - 2rem);
    display: block;
    margin: 0 auto;
    height: calc(100vh - 17.5rem);
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
