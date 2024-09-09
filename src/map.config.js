// eslint-disable-next-line

import { EPSG_28992, EPSG_3857 } from './lib/leaflet-utils/projections';

// This is the attribution (maps and datasets often require attribution of the source)
const attribution = '&copy <a href="http://www.pdok.nl">PDOK</a>';

// The default zoom level
const zoom = {
  [EPSG_28992]: 3,
  [EPSG_3857]: 8,
};

// This is the zoom limit of the map
const maxZoom = {
  [EPSG_28992]: 12,
  [EPSG_3857]: 18,
};

// The maximum zoom of the map
const minZoom = {
  [EPSG_28992]: 2,
  [EPSG_3857]: 5,
};

// This is the default center of the map
const center = [52.0, 5.3];

// Dutch aerial photography and rendered map (default backgrounds)
const tileLayers = [
  {
    title: 'Topografie - water',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png',
      tms: false,
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png',
      tms: true,
    },
  },
  {
    title: 'Topografie - grijs',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png',
      tms: false,
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png',
      tms: true,
    },
  },
  {
    title: 'Topografie',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png',
      tms: false,
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png',
      tms: true,
    },
  },
  {
    title: 'Luchtfoto',
    [EPSG_28992]: {
      url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:28992/{z}/{x}/{y}.jpeg',
      tms: false,
    },
    [EPSG_3857]: {
      url: 'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg',
      tms: true,
    },
  },
  {
    title: 'Geen Achtergrondkaart',
    [EPSG_28992]: {
      url: '',
      tms: false,
    },
    [EPSG_3857]: {
      url: '',
      tms: true,
    },
  },
];

var servicePromise = null;

async function getServices() {
  // return the content of webconfig.json
  // return if we already fetched it (memoize0
  if (servicePromise) {
    return servicePromise;
  }

  let url = 'config/webconfig.json'
  if (location.hostname.includes('netlify.app')) {
    url = 'config/webconfig-netlify.json'
  }

  servicePromise = fetch(url).then(res => res.json());
  return servicePromise;
}

function getCustomMapConfig(services) {
  return {
    administratieve_grenzen_gemeenten: {
      url: services.PDOK_KADASTER_URL,
      config: {
        layers: 'Gemeentegebied',
        styles: 'default',
      },
      legendImageSrc: services.PDOK_GEMEENTEN_LEGEND,
    },
    administratieve_grenzen_provincies: {
      url: services.PDOK_KADASTER_URL,
      config: {
        layers: 'Provinciegebied',
        styles: 'default',
      },
      legendImageSrc: services.PDOK_PROVINCIES_LEGEND,
    },
    administratieve_grenzen_waterschappen: {
      url: services.PDOK_WATERSCHAPPEN_URL,
      config: {
        layers: 'AU.AdministrativeUnit',
        styles: 'default',
      },
      legendImageSrc: services.PDOK_WATERSCHAPPEN_LEGEND,
    },
    infrastructuur_spoorwegen_nederland: {
      url: services.PDOK_SPOORWEGEN_URL,
      config: {
        layers: 'trace',
        styles: 'default',
      },
      legendImageSrc: services.PDOK_SPOORWEGEN_LEGEND,
    }
  }
}

export default {
  getCustomMapConfig,
  attribution,
  center,
  maxZoom,
  minZoom,
  getServices,
  tileLayers,
  zoom,
};
