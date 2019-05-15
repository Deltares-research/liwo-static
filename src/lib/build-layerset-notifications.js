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
            notification: feature.properties.notify,
            // split off the numbers
            layerId: feature.id.replace(/(.+)(\.\d+)/, '$1')
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
  // TODO: get rid of the magic
  // function mapVariants (variants) {
  //   let result = variants
  //       .map(
  //         (variant) => {
  //           return { id: variant.id, notification: notify }
  //         })
  //   return result
  // }

  // function mapLayers (layers, layerId) {
  //   let result = layers
  //       .map((layer) => {
  //         let variants = mapVariants(layer.variants) || []
  //         return { id: layer.id, notification: layer.notify, variants }
  //       })
  //   return result
  // }
  // let featureNotifications = featureNotificationsTree
  //   .reduce((list, layerItems) => ([...list, ...layerItems]), [])
  //   .reduce((collection, {id, notification, layerId}) => ({
  //     ...collection,
  //     [id]: { notification, layerId }
  //   }), {})

  // // TODO: check if this even works
  // const layerSetById = {
  //   [id]: {
  //     notification: notify,
  //     layers
  //   },
  //   ...featureNotifications
  // }
  // return layerSetById
  return featureNotifications
}
