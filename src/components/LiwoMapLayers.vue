<template>
  <span>
    <template
      v-for="layer in layerSet"
    >
      <l-geo-json
        v-if="layer.type === 'json'"
        :ref="layer.id"
        :key="layer.id"
        :geojson="layer.geojson"
        :options="{ style: (feature) => setStyle(feature, layer) , onEachFeature: onEachFeature  }"
      />
      <l-wms-tile-layer
        v-else
        layer-type="base"
        format="image/png"
        :key="layer.id"
        :base-url="geoServerURL(layer.namespace)"
        :layers="layer.layer"
        :styles="layer.style"
        :transparent="true"
      />
    </template>
  </span>
</template>

<script>
import Vue from 'vue'
import { LGeoJson, LWMSTileLayer as LWmsTileLayer } from 'vue2-leaflet'

import BreachTooltip from './BreachTooltip'
import DikeRingTooltip from './DikeRingTooltip'

import renderVue from '../lib/render-vue'

const MARKER_IDENTIFIER = 'Point'
const DIKERING_IDENTIFIER = 'MultiPolygon'

const STATIC_GEOSERVER_URL = 'https://geodata.basisinformatie-overstromingen.nl/geoserver/ows/'
const DYNAMIC_GEOSERVER_URL = 'http://tl-397.xtr.deltares.nl:8080/geoserver/'

export default {
  data () {
    return {
      dijkringen: {},
      doorbraken: {},
      selectedDikeRing: undefined
    }
  },
  props: {
    layerSet: Array,
    mapRef: Object,
  },
  components: {
    LGeoJson,
    LWmsTileLayer
  },
  methods: {
    geoServerURL (namespace) {
      return namespace === 'LIWO_Operationeel'
        ? DYNAMIC_GEOSERVER_URL
        : STATIC_GEOSERVER_URL
    },
    onEachFeature (feature, layer) {
      const dijkringnr = layer.feature.properties.dijkringnr
      const map = this.mapRef.mapObject

      if ( feature.geometry.type === MARKER_IDENTIFIER && dijkringnr !== this.selectedDikeRing ) {
        this.doorbraken[dijkringnr]
          ? this.doorbraken[dijkringnr] = [ ...this.doorbraken[dijkringnr], layer ]
          : this.doorbraken[dijkringnr] = [ layer ]

        const tooltip = renderVue(BreachTooltip, { ...layer.feature.properties } )
        layer.bindTooltip(tooltip)

        layer.once('add', () => map.removeLayer(layer))
      }

      if ( feature.geometry.type !== MARKER_IDENTIFIER ) {
        this.dijkringen[dijkringnr]
          ? this.dijkringen[dijkringnr] = [ ...this.dijkringen[dijkringnr], layer ]
          : this.dijkringen[dijkringnr] = [ layer ]

        const tooltip = renderVue(DikeRingTooltip, { ...layer.feature.properties } )
        layer.bindTooltip(tooltip)

        layer.on('click', () => {
          map.flyToBounds(layer.getBounds())
          this.selectedDikeRing = dijkringnr
          this.doorbraken[dijkringnr].forEach(doorbraak => {
            map.addLayer(doorbraak)
          })
        })
      }
    },
    setStyle (feature, layer) {
      // set the layer to to style object and use css for styling
      return { className: layer.style }
    }
  },
  watch: {
    selectedDikeRing (newDikeRing, oldDikeRing) {
      const map = this.mapRef.mapObject

      if(oldDikeRing === newDikeRing) {
        return
      }

      if(oldDikeRing) {
        this.doorbraken[oldDikeRing].forEach(doorbraak => {
          map.removeLayer(doorbraak)
        })
      }
      
      this.doorbraken[newDikeRing].forEach(doorbraak => {
        map.addLayer(doorbraak)
      })
    }
  }
}
</script>

<style>
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
