import L from '@/lib/leaflet-utils/leaf'

import '@/lib/leaflet-hack'
import rdConfig from '@/lib/rijksdriehoek.config'
import mapConfig from '@/map.config'

// const MAPBOX_ACCES_TOKEN = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6ImNqbHcwcHFjNjBsdGIza3F1dW5iZjhhY2EifQ.zZkkozZlSRtmB9VgpR9HiQ'
const INITIAL_BASELAYER = mapConfig.tileLayers[0].title

export default function (el, config) {
  const tileLayerOptions = baseLayerOptions(config)
  const baseLayers = createBaseLayers(tileLayerOptions)
  const map = L.map(el, { ...config, crs: createCrs() })

  map.addLayer(baseLayers[INITIAL_BASELAYER])
  map.setZoom(config.zoom || mapConfig.zoom)

  map.addControl(geoCoderControl(map))
  map.addControl(L.control.zoom({ position: 'topright' }))
  map.addControl(L.control.layers(baseLayers))
  // Hack to make the map display
  setTimeout(() => { map.invalidateSize() }, 100)

  return map
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

function createBaseLayers (options) {
  return mapConfig.tileLayers.reduce((baseLayers, layer) => ({
    ...baseLayers, [ layer.title ]: L.tileLayer(layer.url, options)
  }), {})
}

function baseLayerOptions (config) {
  return {
    attribution: config.attribution || mapConfig.attribution,
    maxZoom: config.maxZoom || mapConfig.maxZoom,
    minZoom: config.minZoom || mapConfig.minZoom,
    tms: config.baseLayer.tms || mapConfig.baseLayer.tms,
    continuousWorld: config.continuousWorld || mapConfig.continuousWorld,
    zIndex: -1
  }
}

function geoCoderControl (map) {
  return L.Control.geocoder({ position: 'topright', defaultMarkGeocode: false })
    .on('markgeocode', function (e) {
      const bbox = e.geocode.bbox
      const poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ])
      map.fitBounds(poly.getBounds())
    })
}
