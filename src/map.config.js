// eslint-disable-next-line

import { EPSG_28992, EPSG_3857 } from './lib/leaflet-utils/projections'

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
  [EPSG_3857]: 18
}

// The maximum zoom of the map
const minZoom = {
  [EPSG_28992]: 2,
  [EPSG_3857]: 5
}

// This is the default center of the map
const center = [52.0, 5.3]

// Dutch aerial photography and rendered map (default backgrounds)
const tileLayers = [
  {
    title: 'Topografie - water',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png',
      tms: false
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png',
      tms: true
    }
  },
  {
    title: 'Topografie - grijs',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png',
      tms: false
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png',
      tms: true
    }
  },
  {
    title: 'Topografie',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png',
      tms: false
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png',
      tms: true
    }
  },
  {
    title: 'Luchtfoto',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:28992/{z}/{x}/{y}.jpeg',
      tms: false
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg',
      tms: true
    }
  },
  {
    title: 'Geen Achtergrondkaart',
    [EPSG_28992]: {
      url: '',
      tms: false
    },
    [EPSG_3857]: {
      url: '',
      tms: true
    }
  }
]

var services = null

async function getServices () {
  // return the content of webconfig.json
  // return if we already fetched it (memoize0
  if (services) {
    return services
  }

  let url = 'config/webconfig.json'
  if(location.hostname.includes('netlify.app')) {
    url = 'config/webconfig-netlify.json'
  }

  const resp = await fetch(url)
  const result = await resp.json()
  services = result
  return result
}

export default {
  attribution,
  center,
  maxZoom,
  minZoom,
  getServices,
  tileLayers,
  zoom
}
