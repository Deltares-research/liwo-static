// eslint-disable-next-line
const services = {
  // url for webservice calls [ending with a forward slash]
  WEBSERVICE_URL: 'https://basisinformatie-overstromingen.nl/liwo.ws/',
  // url for static geoserver [ending with a forward slash]
  STATIC_GEOSERVER_URL: 'https://geodata.basisinformatie-overstromingen.nl/geoserver/ows/',
  ACHTERGRONDKAART: 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png',
  LUCHTFOTOKAART: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png',
  PDOKLUCHTFOTO: 'http://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms',
  PDOKBRTACHTERGROND: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts',
  MANUAL_URL: 'https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/'
}
// This is the attribution (maps and datasets often require attribution of the source)
const attribution = '&copy <a href="http://www.pdok.nl">PDOK</a>'

// The default zoom level
const zoom = 3

// This is the zoom limit of the map
const maxZoom = 12

// The maximum zoom of the map
const minZoom = 2

// This is the default center of the map
const center = [52, 5.3]


// Resolution of each zoomlevel (pixels per meter)
const resolutions = [
  3440.64, 1720.32, 860.16,
  430.08, 215.04, 107.52,
  53.76, 26.88, 13.44,
  6.72, 3.36, 1.68,
  0.84, 0.42, 0.21,
  0.105, 0.0575
]

// TODO: Add comment explaining variable
const tileLayers = [
  {
    title: 'Achtergrondkaart',
    url: 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png',
    tms: true
  },
  {
    title: 'Luchtkaart',
    url: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png',
    tms: true
  }
]

export default {
  attribution,
  bounds,
  center,
  crsType,
  maxZoom,
  minZoom,
  origin,
  proj,
  resolutions,
  services,
  tileLayers,
  zoom
}
