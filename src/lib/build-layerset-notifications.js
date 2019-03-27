function mapVariants (variants) {
  return variants
    .map(({ map, notify }) => ({ id: map.layer, notification: notify }))
}

function mapLayers (layers) {
  return layers
    .map(({ id, notify, variants: _variants }) => {
      const variants = mapVariants(_variants) || []
      const firstVariant = variants[0] || { id }
      return { id: firstVariant.id, notification: notify, variants }
    })
}

export default function buildLayersetNotifications (foo) {
  const {id, notify, layers: _layers} = foo
  const layers = mapLayers(_layers)

  const layerSetById = {
    [id]: {
      notification: notify,
      layers
    }
  }
  return layerSetById
}
