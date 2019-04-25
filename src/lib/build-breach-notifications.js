export default function buildNotifications (layers) {
  return {
    breach: layers
      .filter(layer => layer.geojson)
      .map(layer => layer.geojson.features
        .map(feature => ({
          id: feature.properties.id,
          notification: feature.properties.notify,
          layerId: feature.id.replace(/(.+)(\.\d+)/, '$1')
        }))
        .filter(
          (item) => {
            let result = item.notification
            if (item.notification === 'NULL') {
              result = false
            }
            return result
          }
        )
      )
      .reduce((list, layerItems) => ([...list, ...layerItems]), [])
      .reduce((collection, {id, notification, layerId}) => ({
        ...collection,
        [id]: { notification, layerId }
      }), {})
  }
}
