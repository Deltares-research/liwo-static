import _ from 'lodash'

function buildLayerSetFeatureNotifications (layers) {
  // create a list of notifications based on the layerset features, the feature that was  used to create the layerSet
  let layerSetFeatureNotifications = layers
    .filter(layer =>
      layer.layerSet?.feature?.properties?.notify ||
      layer.layerObj?.properties?.notify
    )
    .map((layer) => {
      return {
        id: layer.layerSet.id,
        message:
          layer.layerSet?.feature?.properties?.notify ||
          layer.layerObj?.properties?.notify,
        show: true,
        type: 'info'
      }
    })
  layerSetFeatureNotifications = _.filter(layerSetFeatureNotifications)
  // filter out messages that
  // contain NULLs
  layerSetFeatureNotifications = layerSetFeatureNotifications.filter(feature => {
    if (feature.message === 'NULL') {
      return false
    } else {
      return true
    }
  })
  return layerSetFeatureNotifications
}

function buildVariantNotifications (layers) {
  // the list of notifications  on layerSet level
  const variantNotifications = layers
    .filter(layer => layer.variantNotification)
    .map(layer => {
      return {
        id: layer.layer,
        message: layer.variantNotification,
        show: true,
        type: 'info'
      }
    })
  return variantNotifications
}

export default function buildNotifications (layers) {
  const layerSetFeatureNotifications = buildLayerSetFeatureNotifications(layers)
  const variantNotifications = buildVariantNotifications(layers)

  // concatenate all features
  let result = [
    ...layerSetFeatureNotifications,
    ...variantNotifications
  ]

  // remove any doubles
  result = _.uniqWith(result, _.isEqual)
  return result
}
