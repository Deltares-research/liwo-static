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
  maxFeatures: 3000
})

export async function loadGeojson (jsonLayer, { filteredIds = [] } = {}) {
  // fetch the geojson and add it  to the layer

  // no json, nothing to do
  if (!['json', 'cluster'].includes(jsonLayer.type)) {
    return Promise.resolve(jsonLayer)
  }
  const options = requestOptions(jsonLayer)
  const params = new URLSearchParams(options).toString()

  // TODO: remove this, filtering is done client side
  // we need to get the full dataset first anyway
  const filterString = filteredIds.reduce((str, id, index) => {
    const or = index > 0 ? '%20OR%20' : ''
    const idString = `id=${id}`
    return `${str}${or}${idString}`
  }, filteredIds.length ? '&cql_filter=' : '')

  const services = await mapConfig.getServices()
  const url = `${services.STATIC_GEOSERVER_URL}?${params}${filterString}`
  const result = fetch(url, { mode: 'cors' })
    .then(resp => resp.json())
    .then(geojson => {
      geojson.features = geojson.features.map(feature => {
        feature.properties.isControllable = !!jsonLayer.iscontrollayer
        feature.properties.icon = 'default'
        return feature
      })

      return geojson
    })
    .catch(error => console.warn(error, jsonLayer))
  return result
}
