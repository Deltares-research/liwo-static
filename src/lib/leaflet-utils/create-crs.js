import L from '@/lib/leaflet-utils/leaf'
import { EPSG_3857 } from './projections'

const RD = new L.Proj.CRS(
  'EPSG:28992',
  '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', {  
    transformation: L.Transformation(-1, -1, 0, 0),  
    resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420],
    origin: [-285401.920, 903401.920],
    bounds: L.bounds([-285401.920, 903401.920], [595401.920, 22598.080])  
  })

export default function createCrs (projection) {
  // By default return RD...
  return projection === EPSG_3857
    ? L.CRS.EPSG3857
    : RD
}
