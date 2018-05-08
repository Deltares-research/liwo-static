// TODO: Add comment explaining variable
const attribution = '&copy <a href="http://www.pdok.nl">PDOK</a>'

// TODO: Add comment explaining variable
const bounds = [
  [-285401.92, 22598.08],
  [595401.9199999999, 903401.9199999999]
]

// TODO: Add comment explaining variable
const center = [52, 5.3]

// TODO: Add comment explaining variable
const crsType = 'EPSG:28992'

// TODO: Add comment explaining variable
const maxZoom = 3

// TODO: Add comment explaining variable
const minZoom = 3

// TODO: Add comment explaining variable
const origin = [-285401.92, 22598.08]

// Juiste projectieparameters voor Rijksdriehoekstelsel (EPSG:28992):
const proj = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

// Resoluties (pixels per meter) van de zoomniveaus:
const resolutions = [
  3440.64, 1720.32, 860.16,
  430.08, 215.04, 107.52,
  53.76, 26.88, 13.44,
  6.72, 3.36, 1.68,
  0.84, 0.42, 0.21,
  0.105, 0.0575
]

// TODO: Add comment explaining variable
const tms = true

// TODO: Add comment explaining variable
const url = 'https://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/{z}/{x}/{y}.png'

// TODO: Add comment explaining variable
const zoom = 3

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
  tms,
  url,
  zoom
}
