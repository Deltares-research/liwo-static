function mapVariants (variants) {
  return variants
    .map(({ map, notification }) => ({ id: map.layer, notification }))
}

function mapLayers (layers) {
  return layers
    .map(({ id, notification, variants: _variants }) => {
      const variants = mapVariants(_variants) || []
      const firstVariant = variants[0] || { id }
      return { id: firstVariant.id, notification, variants }
    })
}

export default function buildLayersetNotifications (foo) {
  const {id, notification, layers: _layers} = foo
  const layers = mapLayers(_layers)

  const layerSetById = {
    [id]: {
      notification,
      layers
    }
  }
  return layerSetById
}
