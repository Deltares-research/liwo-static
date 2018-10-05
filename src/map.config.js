// eslint-disable-next-line
const services = {
  // url for webservice calls [ending with a forward slash]
  WEBSERVICE_URL: 'http://tw-160.xtr.deltares.nl/liwo.ws/',
  // WEBSERVICE_URL: 'https://basisinformatie-overstromingen.nl/liwo.ws/',
  // url for static geoserver [ending with a forward slash]
  STATIC_GEOSERVER_URL: 'http://tl-396.xtr.deltares.nl:8080/geoserver/ows/',
  // STATIC_GEOSERVER_URL: 'https://profgeodata.static.basisinformatie-overstromingen.nl/geoserver/ows/',
  DYNAMIC_GEOSERVER_URL: 'http://tl-397.xtr.deltares.nl:8080/geoserver/LIWO_Operationeel/wms/',
  // DYNAMIC_GEOSERVER_URL: 'https://profgeodata.dynamic.basisinformatie-overstromingen.nl/geoserver/LIWO_Operationeel/wms/',
  ACHTERGRONDKAART: 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png',
  LUCHTFOTOKAART: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/tms/1.0.0/2016_ortho25/EPSG:28992/{z}/{x}/{y}.png',
  PDOKLUCHTFOTO: 'http://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms',
  PDOKBRTACHTERGROND: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts',
  MANUAL_URL: 'https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/',
  LEGEND_URL: 'https://geodata.basisinformatie-overstromingen.nl/geoserver',
  PRINT_GEO_SERVER: 'https://profgeodata.static.basisinformatie-overstromingen.nl'
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
const center = [52.0, 5.3]

// Dutch aerial photography and rendered map (default backgrounds)
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
  center,
  maxZoom,
  minZoom,
  services,
  tileLayers,
  zoom
}
