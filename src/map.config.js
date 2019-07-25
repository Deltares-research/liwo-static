// eslint-disable-next-line

import { EPSG_28992, EPSG_3857 } from './lib/leaflet-utils/projections'

// These variable names are global and should be defined by loading webconfig.js
const globals = [
  'WEBSERVICE_URL',
  'STATIC_GEOSERVER_URL',
  'DYNAMIC_GEOSERVER_URL',
  'ACHTERGRONDKAART',
  'LUCHTFOTOKAART',
  'PDOKLUCHTFOTO',
  'PDOKBRTACHTERGROND',
  'MANUAL_URL',
  'STATIC_GEOSERVER_URL',
  'PRINT_GEOSERVER_URL',
  'HYDRO_ENGINE_URL'
]

// Assertions
globals.forEach(
  function (v) {
    console.assert(
      // variable should be set by webconfig.js
      window.hasOwnProperty(v),
      // error message if assert fails
      'Make sure variable',
      v,
      'is defined in the webconfig.js and that this file is properly loaded'
    )
  }
)

const services = {
  // url for webservice calls [ending with a forward slash]
  // We use the || shortcut here because we don't expect any falsy values
  // TODO: consider removing this as a configuration all together
  // url for static geoserver [ending with a forward slash]
  WEBSERVICE_URL: window.WEBSERVICE_URL,
  STATIC_GEOSERVER_URL: window.STATIC_GEOSERVER_URL,
  DYNAMIC_GEOSERVER_URL: window.DYNAMIC_GEOSERVER_URL,
  ACHTERGRONDKAART: window.ACHTERGRONDKAART,
  LUCHTFOTOKAART: window.LUCHTFOTOKAART,
  PDOKLUCHTFOTO: window.PDOKLUCHTFOTO,
  PDOKBRTACHTERGROND: window.PDOKBRTACHTERGROND,
  MANUAL_URL: window.MANUAL_URL,
  // TODO: consistent names
  LEGEND_URL: window.STATIC_GEOSERVER_URL,
  // TODO: consistent names
  PRINT_GEO_SERVER: window.PRINT_GEOSERVER_URL,
  // add default, so it keeps working with old config files
  HYDRO_ENGINE: window.HYDRO_ENGINE_URL || 'https://hydro-engine.appspot.com'
}

// This is the attribution (maps and datasets often require attribution of the source)
const attribution = '&copy <a href="http://www.pdok.nl">PDOK</a>'

// The default zoom level
const zoom = {
  [EPSG_28992]: 3,
  [EPSG_3857]: 8
}

// This is the zoom limit of the map
const maxZoom = {
  [EPSG_28992]: 12,
  [EPSG_3857]: 20
}

// The maximum zoom of the map
const minZoom = {
  [EPSG_28992]: 2,
  [EPSG_3857]: 7
}

// This is the default center of the map
const center = [52.0, 5.3]

// Dutch aerial photography and rendered map (default backgrounds)
const tileLayers = [
  {
    title: 'Topografische Kaart',
    [EPSG_28992]: {
      url: 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png',
      tms: true
    },
    [EPSG_3857]: {
      url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:3857/{z}/{x}/{y}.png',
      tms: true
    }
  },
  {
    title: 'Satelietbeeld',
    [EPSG_28992]: {
      url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png',
      tms: true
    },
    [EPSG_3857]: {
      url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.png',
      tms: true
    }
  },
  {
    title: 'Geen Achtergrondkaart',
    [EPSG_28992]: {
      url: '',
      tms: true
    },
    [EPSG_3857]: {
      url: '',
      tms: true
    }
  }
]

export default {
  attribution,
  center,
  maxZoom,
  minZoom,
  services,
  tileLayers,
  zoom
}
