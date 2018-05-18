// This is the projection of the map
const crsType = 'EPSG:28992'

// The bunding box of the coordinate reference system
const bounds = [
  [-285401.92, 22598.08],
  [595401.9199999999, 903401.9199999999]
]

// This is the origin of the projection (Amersfoort)
const origin = [-285401.92, 22598.08]

// Projection parameters for EPSG:28992, see spatialreference.org for details
const proj = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'

// Resolution of each zoomlevel (pixels per meter) when in epsg:28992
const resolutions = [
  3440.64, 1720.32, 860.16,
  430.08, 215.04, 107.52,
  53.76, 26.88, 13.44,
  6.72, 3.36, 1.68,
  0.84, 0.42, 0.21,
  0.105, 0.0575
]

export default {
  crsType,
  bounds,
  origin,
  proj,
  resolutions
}
