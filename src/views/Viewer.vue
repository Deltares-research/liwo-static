<template>
  <div class="viewer">
    <h1>Dit is de over Viewer pagina</h1>
    <div id="map1"></div>
    <l-map
      id="map2"
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      :center="center"
      :crs="crs"
      ref="map"
    >
      <l-tile-layer
        :tms="true"
        :url="url"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :continuousWorld="true"
        :attribution="attribution"
      />
    </l-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import 'proj4leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'

const url = 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png'

export default {
  data: function () {
    const RD = this.createRD()
    return {
      continuousWorld: true,
      crs: RD,
      zoom: 3,
      maxZoom: 13,
      minZoom: 2,
      // maxBounds: L.latLngBounds(L.latLng(50, 1), L.latLng(56, 6)),
      center: L.latLng(52, 5.3),
      attribution: '&copy <a href="http://www.pdok.nl">PDOK</a>',
      url: url
    }
  },
  mounted () {
    const RD = this.createRD()
    var map = L.map('map1', {
      continuousWorld: true,
      crs: RD,
      center: this.center,
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      zoom: this.zoom
    })
    var achtergrondkaart = new L.TileLayer(url,
      {
        tms: true,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        continuousWorld: true
      })
    achtergrondkaart.addTo(map)
    // Gunsan Airport
    L.marker([52, 4]).addTo(map)

    map.setView([52, 4], 5)
    this.$refs.map.mapObject.setView([52, 4], 5)
  },
  components: {
    LMap, LTileLayer
  },
  methods: {
    createRD () {
      // Juiste projectieparameters voor Rijksdriehoekstelsel (EPSG:28992):
      const proj = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

      // Resoluties (pixels per meter) van de zoomniveaus:
      const res = [
        3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44,
        6.72, 3.36, 1.68, 0.84, 0.42, 0.21, 0.105, 0.0575
      ]

      // working example for leaflet 1.0.x was found here: https://gist.github.com/webmappergists/6835958234124c5ea68f
      const RD = new L.Proj.CRS('EPSG:28992', proj, {
        resolutions: res,
        bounds: L.bounds(
          [-285401.92, 22598.08],
          [595401.9199999999, 903401.9199999999]
        ),
        origin: [-285401.92, 22598.08]
      })

      RD.scale = function (zoom) {
        return 1 / res[zoom]
      }
      return RD
    }
  }
}
</script>
<style>

  #map1, #map2 {
    width: 600px;
    height: 400px;
    border: 1px solid red;
  }
</style>
