import L from '@/lib/leaflet-utils/leaf'

import '@/lib/leaflet-hack'
import mapConfig from '@/map.config'
import { EPSG_3857 } from '../../lib/leaflet-utils/projections'
import createCrs from '../../lib/leaflet-utils/create-crs'

const INITIAL_BASELAYER = mapConfig.tileLayers[0].title

export default function (el, config) {
  const tileLayerOptions = baseLayerOptions(config)
  const baseLayers = createBaseLayers(tileLayerOptions)
  const map = L.map(el, {
    ...config,
    crs: createCrs(config.projection),
    layers: [ baseLayers[INITIAL_BASELAYER] ]
  })

  // When we change the baselayer we want it to be in the back
  map.on('baselayerchange', (e) => e.layer.bringToBack())
  // map.addLayer(baseLayers[INITIAL_BASELAYER])
  map.setZoom(config.zoom || mapConfig.zoom)

  map.addControl(geoCoderControl(map))
  map.addControl(L.control.zoom({ position: 'topright' }))
  map.addControl(L.control.layers(baseLayers))

  // Hack to make the map display
  setTimeout(() => { map.invalidateSize() }, 100)

  return map
}

function createBaseLayers (options) {
  return mapConfig.tileLayers.reduce((baseLayers, layer) => ({
    ...baseLayers, [ layer.title ]: L.tileLayer(layer[options.projection].url, options)
  }), {})
}

function baseLayerOptions (config) {
  const tms = config.baseLayer.tms || mapConfig.baseLayer[config.projection].tms
  let options = {
    attribution: config.attribution || mapConfig.attribution,
    maxZoom: config.maxZoom || mapConfig.maxZoom[config.projection],
    minZoom: config.minZoom || mapConfig.minZoom[config.projection],
    tms: config.projection === EPSG_3857 ? undefined : tms,
    continuousWorld: config.continuousWorld || mapConfig.continuousWorld,
    projection: config.projection
  }

  return options
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
