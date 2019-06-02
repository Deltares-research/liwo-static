import _ from 'lodash'

import {
  BREACHES_IDS
} from '@/lib/liwo-identifiers'

export function flattenLayerSet (layerSet) {
  // this method flattens a layerSet from
  // layerSet.layers[].variants[] to
  // [layers] with a layer for each variant or selected variant
  // the layer object is available as in variant.layerObj, the layerSet object in variant.layerSet
  // You can pass this to leaflet.

  // get all the layerSet properties
  let layerSetProperties = _.omit(layerSet, ['layers'])
  // loop over all layers
  let layers = _.map(layerSet.layers, layer => {
    // get all layer properties
    let layerProperties = _.omit(layer, ['variants'])
    // get all variants
    let variantIndex = _.get(layer.properties, 'selectedVariant', null)

    // pick the first varian if there is only 1 variant
    if (layer.variants.length === 1) {
      variantIndex = 0
    }
    if (_.isNil(variantIndex)) {
      console.warn('no variant index set for', layer.id)
      variantIndex = 0
    }
    // select the variant
    let variant = layer.variants[variantIndex]
    // make a copy of the variant as a basis for the flattened layer
    let newLayer = _.clone(variant)
    // copy layer properties in variant
    newLayer.layerObj = layerProperties
    newLayer.layerSet = layerSetProperties
    // return the newLayer as a flat layer
    return newLayer
  })
  // now we have layers[variants[]]
  // so we just need to flatten

  return _.flatten(layers)
}

export function normalizeLayer (layer) {
  //
  // This method restructures the objecs, please add  motivation if you add something here.
  // - Take the namespace of the  first variants map
  // - Take the properties of the map and move them to the variant (drop the map)
  // - Set move layer properties  to .properties
  // - Add the namespace to the layer legend
  let firstVariant = _.first(layer.variants)
  // namespace should be available to legend
  let namespace = _.get(firstVariant, 'map.namespace', '')
  let variants = layer.variants.map(variant => ({
    ...variant.map,
    metadata: variant.metadata,
    title: variant.title,
    iscontrollayer: layer.iscontrollayer
  }))
  let id = _.get(layer, 'legend.layer', layer.id)
  // for  google earth layers take the mapid  of the layer
  if (variants.length === 1 && _.has(layer.variants[0], 'mapid')) {
    id = layer.variants[0].mapid
  }
  let result = {
    // TODO: check why  we are  getting the layer from the legend...

    id: id,
    // copy the rest  of  the layer properties
    properties: _.omit(layer, ['variants']),
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
  // TODO: Why?
  if (layer.style === 'LIWO_Basis_Waterdiepte') {
    layer.hideWms = true
  }

  if (_.isNil(layer.properties.title)) {
    // sometimes the title is not available, fill it in using the name
    layer.properties.title = layer.properties.name
  }

  // select the first variant
  // If you update the selectedVariant, make sure you commit/$set back the layerSet
  // as it should trigger a reload of the map
  layer.properties.selectedVariant = 0

  return layer
}

export function cleanLayerSet (layerSet) {
  layerSet.layers = layerSet.layers.map(
    cleanLayer
  )

  // some scenario layersets have the wrong visibility set
  if (_.has(layerSet, 'feature')) {
    // Set all layers as invisible and ...
    _.each(layerSet.layers, layer => {
      layer.properties.visible = false
    })
    // set the first layer as visible
    _.first(layerSet.layers).properties.visible = true
  }

  return layerSet
}

export function selectFirstVariantsByLayerId (layerSet) {
  let layersWithVariants = layerSet.layers.filter(layer => layer.variants.length > 0)
  let result = {}
  // set the first layer as active
  layersWithVariants.forEach((layer) => {
    result[layer.id] = 0
  })
  return layersWithVariants
}

export function expandLayers () {
  return undefined
}
