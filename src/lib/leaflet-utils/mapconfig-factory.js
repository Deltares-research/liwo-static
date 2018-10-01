import L from '@/lib/leaflet-utils/leaf'

import mapConfig from '../../map.config'
import rdConfig from '@/lib/rijksdriehoek.config.js'

export default function createMapConfig () {
  return {
    continuousWorld: true,
    crs: createCrs(),
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
}

export function createCrs () {
  return new L.Proj.CRS(rdConfig.crsType, rdConfig.proj, {
    resolutions: rdConfig.resolutions,
    bounds: L.bounds(rdConfig.bounds),
    origin: rdConfig.origin
  })
}
