<template>
  <div
    ref="liwoMap"
    class="liwo-map"
    v-leaflet="{
      callbacks: { breachCallBack, initMapObject },
      config: mapConfig,
      mapLayers: [ ...expandedMapLayers ].reverse(),
    }"
  ></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import createMapConfig from '@/lib/leaflet-utils/mapconfig-factory'
import buildBreachNotifications from '@/lib/build-breach-notifications'
import { showLayerInfoPopup } from '@/lib/leaflet-utils/popup'
import { EPSG_28992 } from '@/lib/leaflet-utils/projections'

export default {
  props: {
    projection: {
      type: String,
      default: EPSG_28992
    }
  },
  data () {
    return {
      expandedMapLayers: undefined
    }
  },
  computed: {
    ...mapState([
      'opacityByLayerId',
      'selectedBreaches',
      'layerUnits',
      'selectedLayerId'
    ]),
    ...mapGetters([
      'parsedLayerSet',
      'activeLayerSet'
    ])
  },
  created () {
    this.mapConfig = createMapConfig({
      projection: this.projection
    })
  },
  mounted () {
    this.mapRef = this.$refs.liwoMap
  },
  methods: {
    breachCallBack ({ target }) {
      const { id, naam: breachName, layerType, isControllable } = target.feature.properties
      this.$store.dispatch('addBreach', { id, breachName, layerType, isControllable })
    },
    initMapObject (mapObject) {
      this.$emit('initMap', mapObject)

      mapObject.on('click', event => {
        showLayerInfoPopup({
          map: mapObject,
          activeLayer: this.selectedLayerId,
          unit: this.layerUnits[this.selectedLayerId],
          position: event.containerPoint,
          latlng: event.latlng
        })
      })
    }
  },
  watch: {
    parsedLayerSet (parsedLayerSet) {
      if (!parsedLayerSet) {
        return []
      }

      parsedLayerSet
        .then(
          (layers) => {
            this.expandedMapLayers = Object.freeze(layers)
          })

      parsedLayerSet
        .then(buildBreachNotifications)
        .then(result => this.$store.commit('setBreachNotifications', result))
    }
  }
}
</script>

<style>
  .liwo-map {
    width: calc(100% - 2rem);
    display: block;
    margin: 0 auto;
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
