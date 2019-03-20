import L from '@/lib/leaflet-utils/leaf'
import rdConfig from '@/lib/rijksdriehoek.config'
import { EPSG_3857 } from './projections'

export default function createCrs (projection) {
  return projection === EPSG_3857
    ? L.CRS.EPSG3857
    : new L.Proj.CRS(
      rdConfig.crsType,
      rdConfig.proj,
      {
        resolutions: rdConfig.resolutions,
        bounds: L.bounds(rdConfig.bounds),
        origin: rdConfig.origin
      }
    )
}
