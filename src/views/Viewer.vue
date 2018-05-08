<template>
  <div class="viewer">
    <h1>Dit is de over Viewer pagina</h1>
    <l-map
      style="height: 300px"
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      :center="center"
      :crs="crs"
    >
      <l-tile-layer 
        :url="url" 
        :attribution="attribution"
      />
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet'
import 'proj4leaflet'
import { LMap, LTileLayer } from 'vue2-leaflet'

// Juiste projectieparameters voor Rijksdriehoekstelsel (EPSG:28992):
const proj = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

// Resoluties (pixels per meter) van de zoomniveaus:
const res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105, 0.0575]

// working example for leaflet 1.0.x was found here: https://gist.github.com/webmappergists/6835958234124c5ea68f
const RD = new L.Proj.CRS('EPSG:28992', proj, {
  resolutions: res,
  bounds: L.bounds([-285401.92, 22598.08], [595401.9199999999, 903401.9199999999]),
  origin: [-285401.92, 22598.08]
})

RD.scale = function (zoom) {
  return 1 / res[zoom]
}

// this.map = L.map('map', {
//     continuousWorld: true,
//     crs: RD,
//     center: new L.LatLng(52, 5.3),
//     maxZoom: 13,
//     minZoom: 2,
//     zoom: 3,
//     scrollWheelZoom: true,
//     loadingControl: true,
//     zoomControl: false,
//     animate: false
// });

export default {
  data: function () {
    return {
      continuousWorld: true,
      worldCopyJump: false,
      crs: RD,
      zoom: 10,
      maxZoom: 13,
      minZoom: 2,
      // maxBounds: L.latLngBounds(L.latLng(50, 1), L.latLng(56, 6)),
      center: L.latLng(52, 0),
      attribution: '&copy <a href="http://www.pdok.nl">PDOK</a>',
      url: 'http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png'
    }
  },
  components: {
    LMap, LTileLayer
  }
}
</script>
