import L from '@/lib/leaflet-utils/leaf'

import mapConfig from '../../map.config'
import createCrs from '../leaflet-utils/create-crs'

export default function createMapConfig ({ projection }) {
  return {
    projection,
    continuousWorld: true,
    crs: createCrs(projection),
    zoomControl: false,
    zoomAnimation: false,
    zoom: mapConfig.zoom[projection],
    maxZoom: mapConfig.maxZoom[projection],
    minZoom: mapConfig.minZoom[projection],
    center: L.latLng(...mapConfig.center),
    attribution: mapConfig.attribution,
    baseLayer: {
      tms: mapConfig.tileLayers[0][projection].tms,
      tileLayers: mapConfig.tileLayers,
      url: mapConfig.tileLayers[0][projection].url
    }
  }
}
