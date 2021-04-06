<template>
  <div>
    <div
      ref="liwoMap"
      class="liwo-map"
      v-leaflet="{
      callbacks: { onClick, initMapObject },
      config: mapConfig,
      layers: layers,
      cluster: clusterMarkers,
      }"
    ></div>
    <div ref="legend">
      <slot name="legend"></slot>
    </div>

  </div>

</template>

<script>
import debounce from 'lodash/debounce'
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
  methods: {
    onClick (event) {
      // TODO: click on what
      this.$emit('click', event)
    },
    initMapObject (mapObject) {
      this.$emit('initMap', mapObject)
      // pass along click to map objects
      mapObject.on('click', event => {
        // pass the  map click event on up
        this.$emit('map:click', event)
      })
      this.setPosition(mapObject)
      this.addPositionListeners(mapObject)
    },
    setPosition (map) {
      const { zoom, center } = this.$route.query

      if (zoom) {
        map.setZoom(zoom)
      }

      if (center) {
        const [lat, lng] = center.split(',')
        map.setView([lat, lng])
      }
    },
    addPositionListeners (map) {
      map.on('move', debounce((e) => {
        const { lat, lng } = e.target.getCenter()
        const zoom = e.target.getZoom()
        this.$router.replace({
          ...this.$route,
          query: {
            ...this.$route.query,
            center: `${lat.toFixed(3)},${lng.toFixed(3)}`,
            zoom
          }
        })
      }, 100))
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
