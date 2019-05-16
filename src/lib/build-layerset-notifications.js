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
    .filter(layer => layer.layer.properties.notify)
    .map(layer => {
      return {
        id: layer.layer.id,
        message: layer.layer.properties.notify,
        show: true
      }
    })
  let layerSetNotifications = layers
    .filter(layer => layer.layerSet.notify)
    .map(layer => {
      return {
        id: layer.layerSet.id,
        message: layer.layerSet.notify,
        show: true
      }
    })

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
  let result = [...featureNotifications, ...layerNotifications, ...layerSetNotifications]
  result = _.uniqWith(result, _.isEqual)
  return result
}
