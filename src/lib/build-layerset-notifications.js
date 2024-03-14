import _ from 'lodash'

function buildLayerSetFeatureNotifications (layers) {
  // create a list of notifications based on the layerset features, the feature that was  used to create the layerSet
  const layerSetFeatureNotifications = layers
    .filter(layer => layer.layerSet?.feature?.properties?.notify)
    .map((layer) => {
      return buildNotification(layer.layerSet.id, layer.layerSet?.feature?.properties?.notify)
    })
  return layerSetFeatureNotifications
}

function buildVariantNotifications (layers) {
  // the list of notifications  on layerSet level
  const variantNotifications = layers
    .filter(layer => layer.variantNotification)
    .map(layer => {
      return buildNotification(layer.layer, layer.variantNotification)
    })
  return variantNotifications
}

function buildLayerSetNotifications (layers) {
  const layerSetNotifications = layers
    .filter(layer => layer.layerSet?.notify)
    .map(layer => {
      return buildNotification(layer.layerSet.id, layer.layerSet?.notify)
    })
  return layerSetNotifications
}

export default function buildNotifications (layers) {
  const layerSetFeatureNotifications = buildLayerSetFeatureNotifications(layers)
  const variantNotifications = buildVariantNotifications(layers)
  const layerSetNotifications = buildLayerSetNotifications(layers)

  // concatenate all features
  let result = [
    ...layerSetFeatureNotifications,
    ...variantNotifications,
    ...layerSetNotifications
  ]

  // remove any doubles
  result = _.uniqWith(result, _.isEqual)
  return result
}

function buildNotification(id, message) {
  return {
    id,
    message,
    show: true,
    type: 'info'
  }
}
