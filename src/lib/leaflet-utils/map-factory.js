//import Vue from 'vue'
import L from '@/lib/leaflet-utils/leaf'

import '@/lib/leaflet-hack'
import mapConfig from '@/map.config'
import { EPSG_3857 } from '../../lib/leaflet-utils/projections'
import createCrs from '../../lib/leaflet-utils/create-crs'
import MapFillWindowControl from '../../components/MapFillWindowControl.vue'
import northIcon from '../../img/north-arrow.svg'
import { createApp } from 'vue'

const INITIAL_BASELAYER = mapConfig.tileLayers[0].title

export default function (el, config, { onPrint }) {
  const tileLayerOptions = baseLayerOptions(config)
  const baseLayers = createBaseLayers(tileLayerOptions)

  const map = L.map(el, {
    ...config,
    crs: createCrs(config.projection),
    layers: [baseLayers[INITIAL_BASELAYER]],
  })

  // This hides the attribution prefix
  // (e.g. "leaflet") from the attribution control
  map.attributionControl.setPrefix(false)

  // When we change the baselayer we want it to be in the back
  map.on('baselayerchange', (e) => e.layer.bringToBack())
  // map.addLayer(baseLayers[INITIAL_BASELAYER])
  map.setZoom(config.zoom || mapConfig.zoom)

  map.addControl(roseControl())
  map.addControl(fillWindowControl())
  map.addControl(geoCoderControl(map))
  map.addControl(L.control.zoom({
    position: 'topright',
    zoomInTitle: 'Kaart inzoomen',
    zoomOutTitle: 'Kaart uitzoomen'
  }))
  map.addControl(L.control.scale({ position: 'bottomleft', imperial: false }))

  map.addControl(printControl())

  map.addControl(layerControl(baseLayers))

  map.on('browser-print-start', onPrint)


  return map
}

function createBaseLayers(options) {
  const baseLayers = {}
  mapConfig.tileLayers.forEach((layer) => {
    baseLayers[layer.title] = L.tileLayer(
      layer[options.projection].url,
      options
    )
  })
  return baseLayers
}

function baseLayerOptions(config) {
  const tms = config.baseLayer.tms
  const options = {
    attribution: config.attribution || mapConfig.attribution,
    maxZoom: config.maxZoom || mapConfig.maxZoom[config.projection],
    minZoom: config.minZoom || mapConfig.minZoom[config.projection],
    tms: config.projection === EPSG_3857 ? undefined : tms,
    continuousWorld: config.continuousWorld || mapConfig.continuousWorld,
    projection: config.projection,
  }

  return options
}

// because leaflet provides no way of telling if the controls have rendered,
// we watch the control object until the dom element is created
function whenReady(control, cb) {
  return new Proxy(control, {
    set(target, key, value) {
      if (key === '_container') {
        cb(value)
      }

      target[key] = value
      return true
    },
  })
}

function geoCoderControl(map) {
  let containerListenerInitialized = false

  const control = L.Control.geocoder({
    position: 'topright',
    defaultMarkGeocode: false,
    iconLabel: 'Start een nieuwe zoekopdracht',
    placeholder: 'Zoeken',
  }).on('markgeocode', function (e) {
    const bbox = e.geocode.bbox
    const poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest(),
    ])
    map.fitBounds(poly.getBounds())
  })

  // add listeners for a11y
  function addListeners(el) {
    // make sure the listeners are only set once
    if (!containerListenerInitialized) {
      const button = el.querySelector('button')

      // the control does not expand when programmatically clicking the trigger button (with keyboard e.g.),
      // so we add a listener that expands the control on click
      button.addEventListener('click', () => {
        control._expand()
      })

      // when the control is closed using the escape key, the focus should go back to the trigger button
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
          button.focus()
        }
      })

      containerListenerInitialized = true
    }
  }

  return whenReady(control, (el) => {
    addListeners(el)
  })
}

function printControl() {
  const control = L.control.browserPrint({
    position: 'topright',
    printModes: [L.BrowserPrint.Mode.Landscape()],
    title: 'Kaart afdrukken'
  })

  function makeFocusable(el) {
    const trigger = el.querySelector('.leaflet-browser-print')

    // add a href attribute, otherwise the browser will nog recognize it as focusable
    trigger.setAttribute('href', '#')

    // Fix for sudden 404 page when clicking on print
    trigger.addEventListener('click', (e) => {
      e.preventDefault()
    })
  }

  return whenReady(control, (el) => {
    makeFocusable(el)
  })
}

function layerControl(layers) {
  const control = L.control.layers(layers)

  function addListener(el) {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        control.collapse()
      }
    })
  }

  return whenReady(control, (el) => {
    const link = el.querySelector('a')
    if(link) {
      link.setAttribute('title', 'Lagen')
    }
    addListener(el)
  })
}

function fillWindowControl() {
  const control = L.control({
    position: 'topright'
  })

  control.onAdd = function (map) {
    const div = L.DomUtil.create('div', '')

    // mount vue component as control
    const button = createApp(MapFillWindowControl, {
      map,
    }).mount(div)

    return button.$el
  }

  return control
}

function roseControl() {
  const control = L.control({ position: 'topright' })

  control.onAdd = function () {
    var div = L.DomUtil.create('div', '')

    div.classList.add('leaflet-control-map-rose')

    div.innerHTML = `<img width='34' style='padding:4px' src='${northIcon}' alt=''>`

    return div
  }

  return control
}
