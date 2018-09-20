import L from 'leaflet'
import 'proj4leaflet'

import '../leaflet-hack'
import rdConfig from '../rijksdriehoek.config.js'
import mapConfig from '../../map.config.js'

import 'leaflet/dist/leaflet.css'

export default function (el, config) {
  const map = L.map(el, { ...config, crs: createCrs() })
  const tileLayerUrl = config.baseLayer.url || mapConfig.baseLayer.url
  const tileLayerOptions = {
    attribution: config.attribution || mapConfig.attribution,
    maxZoom: config.maxZoom || mapConfig.maxZoom,
    minZoom: config.minZoom || mapConfig.minZoom,
    tms: config.baseLayer.tms || mapConfig.baseLayer.tms,
    continuousWorld: config.continuousWorld || mapConfig.continuousWorld
  }

  map.addLayer(L.tileLayer(tileLayerUrl, tileLayerOptions))
  map.setZoom(config.zoom || mapConfig.zoom)
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
