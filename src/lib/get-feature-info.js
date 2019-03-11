import geoServerUrl from './geoserver-url'

export default function getFeatureInfo ({ ne, sw, x, y, width, height, layer }) {
  const bbox = [
    sw.lng,
    sw.lat,
    ne.lng,
    ne.lat
  ].join()

  const url = geoServerUrl({
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
  })

  return fetch(url)
    .then(response => response.json())
    .then(({ features }) => features[0])
    .then((feature) => ({
      ...feature,
      id: String(feature.properties.id)
    }))
    .catch(() => undefined)
}
