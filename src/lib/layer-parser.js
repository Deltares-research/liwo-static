export function normalizeLayer (layer) {
  return {
    id: layer.legend.layer || layer.id,
    properties: layer,
    iscontrollayer: layer.iscontrollayer,
    legend: {
      ...layer.legend,
      namespace: layer.variants[0].map.namespace // namespace should be available to legend
    },
    variants: layer.variants.map(variant => ({
      ...variant.map,
      metadata: variant.metadata,
      title: variant.title,
      iscontrollayer: layer.iscontrollayer
    }))
  }
}

export function normalizeLayers (layers) {
  return layers.map(normalizeLayer)
}

export function expandLayers () {
  return undefined
}
