function mapVariants (variants) {
  return variants
    .map(({ map, notify }) => ({ id: map.layer, notification: notify }))
}

function mapLayers (layers, layerId) {
  return layers
    .map(({ id, notify, variants: _variants }) => {
      const variants = mapVariants(_variants) || []
      return { id: layerId, notification: notify, variants }
    })
}

export default function buildLayersetNotifications (foo, layerId) {
  const {id, notify, layers: _layers} = foo

  const layers = mapLayers(_layers, layerId)

  const layerSetById = {
    [id]: {
      notification: notify,
      layers
    }
  }

  return layerSetById
}
