import query from 'query-string'
import mapConfig from '../map.config.js'

export default async function getFeatureInfo ({ bounds, x, y, width, height, layer }) {
  const bbox = [
    bounds._southWest.lng,
    bounds._southWest.lat,
    bounds._northEast.lng,
    bounds._northEast.lat
  ].join()

  const services = await mapConfig.getServices()

  const params = query.stringify({
    request: 'GetFeatureInfo',
    service: 'WMS',
    info_format: 'application/json',
    srs: 'EPSG:4326',
    layers: layer,
    query_layers: layer,
    width: width,
    height: height,
    x: Math.round(x),
    y: Math.round(y),
    bbox
  }, { encode: true, sort: false })

  return fetch(`${services.STATIC_GEOSERVER_URL}?${params}`)
    .then(response => response.json())
    .then(({ features }) => features[0])
    .then((feature) => ({
      ...feature,
      id: String(feature.properties.id)
    }))
    .catch(() => undefined)
}
