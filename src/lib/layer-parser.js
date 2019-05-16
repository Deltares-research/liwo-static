import _ from 'lodash'
import L from 'leaflet'

import {
  BREACH_PRIMARY,
  BREACH_REGIONAL,
  BREACH_OUTSIDE_DIKE,
  BREACH_FLOODING,
  BREACHES_IDS
} from '@/lib/liwo-identifiers'
import {
  blackIcon,
  greenIcon,
  redIcon
} from '@/lib/leaflet-utils/markers'

const DEFAULT_ICON = new L.Icon.Default()

export function flattenLayerSet (layerSet) {
  // get all the layerSet propreties
  let layerSetProperties = _.omit(layerSet, ['layers'])
  // loop over all layers
  let layers = _.map(layerSet.layers, layer => {
    // get all layer properties
    let layerProperties = _.omit(layer, ['variants'])
    // get all variants
    let variants = _.map(layer.variants, variant => {
      let variantProperties = _.clone(variant)
      // copy layer properties in variant
      variantProperties.layer = layerProperties
      variantProperties.layerSet = layerSetProperties
      return variantProperties
    })
    return variants
  })
  // now we have layers[variants[]]
  // so we just need to flatten
  return _.flatten(layers)
}

export function normalizeLayer (layer) {
  let firstVariant = _.first(layer.variants)
  // namespace should be available to legend
  let namespace = _.get(firstVariant, 'map.namespace', '')
  let variants = layer.variants.map(variant => ({
    ...variant.map,
    metadata: variant.metadata,
    title: variant.title,
    iscontrollayer: layer.iscontrollayer
  }))
  let result = {
    id: layer.legend.layer || layer.id,
    properties: layer,
    iscontrollayer: layer.iscontrollayer,
    legend: {
      ...layer.legend,
      namespace: namespace
    },
    variants
  }
  return result
}

export function normalizeLayerSet (layerSet) {
  layerSet.layers = layerSet.layers.map(normalizeLayer)
  return layerSet
}

export function cleanLayer (layer) {
  // Put all the work to cleanup the data before we can use it here

  // Breach geojson need to be clustered.
  // Change layer type to cluster
  if (_.includes(BREACHES_IDS, layer.id)) {
    // if we have a breach, add the cluster behaviour
    _.each(layer.variants, (variant) => {
      variant.type = 'cluster'
    })
  }

  // TODO: do this using css
  // Layers need an icon. But  the icon depends on the selected state
  layer.getIcon = (layer) => {
    if (layer.properties.selected) {
      return redIcon
    }
    switch (layer.type) {
      case BREACH_PRIMARY:
        return DEFAULT_ICON
      case BREACH_REGIONAL:
        return greenIcon
      case BREACH_OUTSIDE_DIKE:
        return blackIcon
      case BREACH_FLOODING:
        return blackIcon
      default:
        return DEFAULT_ICON
    }
  }

  // TODO: Why?
  if (layer.style === 'LIWO_Basis_Waterdiepte') {
    layer.hideWms = true
  }

  return layer
}

export function cleanLayerSet (layerSet) {
  layerSet.layers = layerSet.layers.map(
    cleanLayer
  )
  return layerSet
}

export function expandLayers () {
  return undefined
}
