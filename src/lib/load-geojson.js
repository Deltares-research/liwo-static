import mapConfig from '../map.config.js'

const requestOptions = ({ namespace, layer }) => ({
  isActive: true,
  service: 'WFS',
  version: '1.0.0',
  request: 'getFeature',
  typeName: `${namespace}:${layer}`,
  outputFormat: 'application/json',
  // get this info unprojected
  // formally geojson does not support CRS
  srsName: 'EPSG:4326',
  maxFeatures: 2000
})

export default function (layer) {
  if (layer.type.toLowerCase() === 'json') {
    const options = requestOptions(layer)
    const params = new URLSearchParams(options).toString()

    return fetch(`${mapConfig.services.STATIC_GEOSERVER_URL}?${params}`, { mode: 'cors' })
      .then(resp => resp.json())
      .catch(error => console.log('Error:', error, layer))
  }
}
