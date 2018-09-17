import 'proj4leaflet'
import L from 'leaflet'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import '../lib/leaflet-hack'
import rdConfig from './rijksdriehoek.config.js'
import mapConfig from '../map.config.js'

const BREACHES_LAYER_ID = 'geo_doorbraaklocaties_primair'
const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL
const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL

// const _LeafletState = {
//   map: undefined,
//   currentLayers: [],
//   breachesCluster: L.markerClusterGroup()
// }

let map
let currentLayers = []

export default {
  bind (el, { value }) {
    const { config } = value
    const tileLayerUrl = config.baseLayer.url
    const tileLayerOptions = {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
      tms: config.baseLayer.tms,
      continuousWorld: config.continuousWorld
    }

    map = L.map(el, { ...config, crs: createCrs() })
    L.tileLayer(tileLayerUrl, tileLayerOptions).addTo(map)
    map.setZoom(config.zoom)

    // Hack to make the map display
    setTimeout(() => { map.invalidateSize() }, 100)
  },
  update (_, { value }) {
    const { mapLayers } = value
    // const { map, currentLayers } = _LeafletState

    console.log('MAPLAYERS', mapLayers)

    if (currentLayers.length) {
      currentLayers.map(layer => {
        map.removeLayer(layer)
      })
      currentLayers = []
    }

    mapLayers.map(renderLayer)
  }
}

function createCrs () {
  return new L.Proj.CRS(
    rdConfig.crsType,
    rdConfig.proj,
    {
      resolutions: rdConfig.resolutions,
      bounds: L.bounds(rdConfig.bounds),
      origin: rdConfig.origin
    }
  )
}

function renderLayer (layer) {
  // const { map, currentLayers } = _LeafletState

  if (layer.type === 'json' && layer.geojson) {
    let geojson

    console.log('GEOJSON LAYER', layer)

    if (layer.layer === BREACHES_LAYER_ID) {
      geojson = renderBreachGeoJson(layer)

      const markers = L.markerClusterGroup()
      let layers = geojson.getLayers()
      console.log('layers', layers)
      markers.addLayer(geojson)

      map.addLayer(markers)
      map.fitBounds(geojson.getBounds())
    } else {
      geojson = renderGeoJson(layer, map)
      map.addLayer(geojson)
    }

    currentLayers.push(geojson)
    console.log('GEOJSON LAYER', layer)
    console.log('GEOJSON', geojson)
  } else {
    const wmsLayer = renderWms(layer)
    map.addLayer(wmsLayer)
    currentLayers.push(wmsLayer)
  }
}

function renderGeoJson ({ geojson, style }) {
  return L.geoJson(geojson, {
    style: () => {
      return { className: style }
    }
  })
}

function renderBreachGeoJson ({ geojson }) {
  return L.geoJson(geojson, {
    // pointToLayer: (_, latlng) => {
    //   return L.circleMarker(latlng)
    // },
    // onEachFeature: (_, layer) => {
    //   _LeafletState.breachesCluster.addLayer(layer)
    // }
  })
}

function renderWms ({ namespace, layer, attribution, style }) {
  return L.tileLayer.wms(geoServerURL(namespace), {
    layers: layer,
    format: 'image/png',
    transparent: true,
    attribution,
    styles: style
  })
}

// function removeCurrentLayers (layers, map) {
//   console.log('remove current markers', layers)
//   layers.forEach(map.removeLayer)
// }

function geoServerURL (namespace) {
  return namespace === 'LIWO_Operationeel'
    ? DYNAMIC_GEOSERVER_URL
    : STATIC_GEOSERVER_URL
}
