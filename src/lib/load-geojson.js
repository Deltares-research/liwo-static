import mapConfig from '../map.config.js'
import store from '@/store'

const MAX_RETRIES = 5
const RETRY_DELAY = 1000 // Delay in milliseconds between retries

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

const getFeatures = (url, jsonLayer, layerSetId, retries = 0) => {
  return new Promise((resolve, reject) => {
    fetch(url, { mode: 'cors' })
      .then(resp => {
        // Workaround for geoserver issue:
        // When the request fails it returns 200 but the response is an XML with an error message
        // We can detect this by checking the content-type header
        if (
          resp.headers.get('content-type') &&
          !resp.headers.get('content-type').includes('application/json')
        ) {
          caches.delete(url)
          throw new Error('Response is not JSON')
        }
        return resp.json()
      })
      .then(geojson => {
        geojson.features = geojson.features.map(feature => {
          feature.properties.isControllable = !!jsonLayer.iscontrollayer
          feature.properties.icon = 'default'
          return feature
        })

        resolve(geojson)
      })
      .catch(error => {
        if (retries < MAX_RETRIES) {
          console.warn(`Retry ${retries + 1} - ${error}`)
          setTimeout(
            () =>
              getFeatures(url, jsonLayer, layerSetId, retries + 1)
                .then(resolve)
                .catch(reject),
            RETRY_DELAY
          )
        } else {
          console.error(`Max retries exceeded - ${error}`)
          // Show an error notification if the layer is not available
          const notification = {
            message: 'Probeer het over 5 tot 10 minuten opnieuw.',
            type: 'error',
            show: true
          }
          store.commit('addNotificationById', { id: layerSetId, notification })
          reject(error)
        }
      })
  })
}

export async function loadGeojson (jsonLayer, layerSetId, { filteredIds = [] } = {}) {
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
  const result = getFeatures(url, jsonLayer, layerSetId)
    .then(geojson => {
      return geojson
    })
    .catch(error => {
      console.warn(error, jsonLayer)
    })
  return result
}
