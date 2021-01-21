import L from '@/lib/leaflet-utils/leaf'

import '@/lib/leaflet-hack'
import mapConfig from '@/map.config'
import { EPSG_3857 } from '../../lib/leaflet-utils/projections'
import createCrs from '../../lib/leaflet-utils/create-crs'

const INITIAL_BASELAYER = mapConfig.tileLayers[0].title

export default function (el, vnode, config) {
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

  map.addControl(printControl())

  map.addControl(L.control.layers(baseLayers))

  map.on('browser-print-start', function (e) {
    // when printing starts emit an event to the containing element so that we can add a legend
    vnode.context.$emit('browser-print-start', e)
  })

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

function whenReady (Control, cb) {
  return new Proxy(Control, {
    set (target, key, value) {
      if (key === '_container') {
        cb(value)
      }

      target[key] = value
      return true
    }
  })
}

function geoCoderControl (map) {
  let containerListenerInitialized = false

  const Control = L.Control.geocoder({ position: 'topright', defaultMarkGeocode: false })
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

  function addListeners (el) {
    if (!containerListenerInitialized) {
      const button = el.querySelector('button')
      button.addEventListener('click', () => {
        Control._expand()
      })

      el.addEventListener('keydown', e => {
        if (e.key === 'Escape' || e.keyCode === 27) {
          button.focus()
        }
      })

      containerListenerInitialized = true
    }
  }

  return whenReady(Control, el => {
    addListeners(el)
  })
}

function printControl () {
  let Control = L.control.browserPrint({position: 'topright', printModes: ['auto']})

  function makeFocusable (el) {
    const trigger = el.querySelector('.leaflet-browser-print')

    trigger.setAttribute('href', '#')
  }

  return whenReady(Control, el => {
    makeFocusable(el)
  })
}
