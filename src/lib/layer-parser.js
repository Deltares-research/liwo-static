import _ from 'lodash'

import {
  BREACH_PREFIX
} from '@/lib/liwo-identifiers'

export function flattenLayerSet (layerSet) {
  if (!layerSet) {
    return []
  }
  // this method flattens a layerSet from
  // layerSet.layers[].variants[] to
  // [layers] with a layer for each variant or selected variant
  // the layer object is available as in variant.layerObj, the layerSet object in variant.layerSet
  // You can pass this to leaflet.

  // get all the layerSet properties
  const layerSetProperties = _.omit(layerSet, ['layers'])
  // loop over all layers
  const layers = _.map(layerSet.layers, layer => {
    // get all layer properties
    const layerProperties = _.omit(layer, ['variants'])
    // get all variants

    let variant = {}
    // select the variant
    const selectedVariant = layer.properties.selectedVariant || layer.variants[0].layer

    // If there is for any reason no variant, select the first one
    if (!selectedVariant) {
      variant = layer.variants[0]
    }

    // pick the selected variant
    if (selectedVariant) {
      variant = layer.variants.find((variant) => variant.layer === selectedVariant) || {}
      layer.properties.selectedVariant = selectedVariant
    }

    // make a copy of the variant as a basis for the flattened layer
    const newLayer = _.clone(variant)
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
  const firstVariant = _.first(layer.variants)
  // namespace should be available to legend
  const namespace = _.get(firstVariant, 'map.namespace', '')
  const variants = layer.variants.map(variant => ({
    ...variant.map,
    metadata: variant.metadata,
    properties: variant.properties,
    title: variant.title,
    iscontrollayer: layer.iscontrollayer,
    variantNotification: variant.notification,
  }))

  // Create an id based on the layer in geoserver, or the layer  in  mapbox
  let id = _.get(layer, 'legend.layer', layer.id)

  // Create an extra id of the combination with bands (referenced by style in geoserver)
  const breachBandId = id + '__' + layer.legend.style

  // for  google earth layers take the mapid  of the layer
  if (variants.length === 1 && _.has(layer.variants[0], 'mapid')) {
    id = layer.variants[0].mapid
  }
  const result = {
    // TODO: check why  we are  getting the layer from the legend...

    id: id,
    breachBandId,
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
  if (layer.id.startsWith(BREACH_PREFIX)) {
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
  layer.properties.selectedVariant = null

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
    if (layerSet.layers.length > 0) {
      // set the first layer as visible
      layerSet.layers[0].properties.visible = true
    }
  }

  return layerSet
}

export function selectFirstVariantsByLayerId (layerSet) {
  const layersWithVariants = layerSet.layers.filter(layer => layer.variants.length > 0)
  const result = {}
  // set the first layer as active
  layersWithVariants.forEach((layer) => {
    result[layer.id] = 0
  })
  return layersWithVariants
}

export function selectVariantsInLayerSet (layerSet, scenarioIds) {
  // Define a variant to use in the selectedVariant property
  let variantId = null
  // Loop over all layers and select variants based on the scenarioIds
  layerSet.layers.forEach(layer => {
    // loop until we found a scenarioId
    layer.variants.some((variant) => {
      const variantScenarioId = Number(variant.layer.replace('scenario_', ''))
      if (scenarioIds.includes(variant.map_id) || scenarioIds.includes(variantScenarioId)) {
        variantId = variant.layer
        layer.properties.selectedVariant = variantId
        return true
      } else {
        // Use the defined variant as default or the first variant
        layer.properties.selectedVariant = variantId || variant.layer
        return false
      }
    })
  })
  return layerSet
}

export function expandLayers () {
  return undefined
}
