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

export default function (jsonLayer, { filteredIds = [] } = {}) {
  if (jsonLayer.type.toLowerCase() === 'json') {
    const options = requestOptions(jsonLayer)
    const params = new URLSearchParams(options).toString()

    const filterString = filteredIds.reduce((str, id, index) => {
      const or = index > 0 ? '%20OR%20' : ''
      const idString = `id=${id}`
      return `${str}${or}${idString}`
    }, filteredIds.length ? '&cql_filter=' : '')

    return fetch(`${mapConfig.services.STATIC_GEOSERVER_URL}?${params}${filterString}`, { mode: 'cors' })
      .then(resp => resp.json())
      .then(result => {
        result.features = result.features.map(feature => ({
          ...feature,
          properties: Object.assign(feature.properties, { isControllable: !!jsonLayer.iscontrollayer })
        }))
        return result
      })
      .catch(error => console.log('Error:', error, jsonLayer))
  }
}
