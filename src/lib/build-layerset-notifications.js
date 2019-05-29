import _ from 'lodash'

export default function buildLayerSetNotifications (layers) {
  //  TODO: clean this up
  let featureNotificationsTree = layers
  // for all layers that have geojson
    .filter(layer => layer.geojson)
    .map(
      layer => layer.geojson.features
      // for  all features  in each layer
        .map(
          feature => ({
            id: feature.properties.id,
            message: feature.properties.notify,
            // split off the numbers
            layerId: feature.id.replace(/(.+)(\.\d+)/, '$1'),
            show: true
          }))
        .filter(
          // replace items with zeros
          (item) => {
            let result = item.notification
            if (item.notification === 'NULL') {
              result = false
            }
            return result
          }
        )
    )
  let featureNotifications = _.flatten(featureNotificationsTree)
  let layerNotifications = layers
    .filter(layer => layer.layerObj.properties.notify)
    .map(layer => {
      return {
        id: layer.layerObj.id,
        message: layer.layerObj.properties.notify,
        show: true
      }
    })

  let layerSetFeatureNotifications = layers
    .filter(layer => _.get(layer, 'layerSet.feature.properties.notify'))
    .map((layer) => {
      return {
        id: layer.layerSet.id,
        message: _.get(layer, 'layerSet.feature.properties.notify'),
        show: true
      }
    })

  layerSetFeatureNotifications = _.filter(layerSetFeatureNotifications)

  let layerSetNotifications = layers
    .filter(layer => layer.layerSet.notify)
    .map(layer => {
      return {
        id: layer.layerSet.id,
        message: layer.layerSet.notify,
        show: true
      }
    })

  // filter out messages that
  layerSetFeatureNotifications = layerSetFeatureNotifications.filter(feature => {
    if (feature.message === 'NULL') {
      return false
    } else {
      return true
    }
  })

  // concatenate all features
  let result = [
    ...featureNotifications,
    ...layerNotifications,
    ...layerSetFeatureNotifications,
    ...layerSetNotifications
  ]

  // remove any doubles
  result = _.uniqWith(result, _.isEqual)
  return result
}
