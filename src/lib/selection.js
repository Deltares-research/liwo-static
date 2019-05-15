import L from 'leaflet'
import {
  BREACH_SELECTED
} from '@/lib/liwo-identifiers'

// TODO: move this somewhere else
export function selectFeatures (layer, ids) {
  // TODO: check if this can be done more elegant...

  // if layer is not editable
  if (!layer.iscontrollayer) {
    return layer
  }
  // if we don't have features we're done
  if (!['json', 'cluster'].includes(layer.type)) {
    return layer
  }

  const activeFeatures = layer.geojson.features.filter(
    feature => ids.find(id => id === feature.properties.id)
  )

  // until here...

  if (!activeFeatures.length) {
    return layer
  }
  // if we  have selected features add a LayerGroup
  let extraLayers = activeFeatures.map(activeFeature => {
    activeFeature.properties.selected = true

    // TODO: seperate feature selection and layer activation
    // const breachLayer = breachLayersById[activeFeature.properties.id].layers[0]

    // if (breachLayer && breachLayer.variants.length > 1) {
    //   const selectedIndex = visibleVariantIndexByLayerId[breachLayer.id]
    //   const selectedVariant = breachLayer.variants[selectedIndex]
    //   activeFeature.properties.selectedVariant = selectedVariant.title
    // }

    // remove feature from its current layer
    layer.geojson.features = layer.geojson.features.filter(
      // feature.id?
      feature => !ids.includes(feature.properties.id)
    )

    layer.geojson.totalFeatures = layer.geojson.features.length

    // create layer for selected feature
    // TODO: what is this??
    let hide = false
    // seperate layer selection from feature selection
    // let hide = hiddenLayers.includes(activeFeature.properties.id)
    return {
      ...layer,
      hide: hide,
      namespace: layer.namespace,
      layer: BREACH_SELECTED,
      layerId: BREACH_SELECTED,
      layerTitle: 'Geselecteerde locatie',
      geojson: {
        ...layer.geojson,
        totalFeatures: 1,
        features: [activeFeature]
      }
    }
  })
  // TODO: why so difficult, can't we just use some css and styling and filtering
  let selectedLayers = [layer, ...extraLayers]
  // layer will become LayerGroup([  layer, selectedFeature ])
  let layers = L.layerGroup(selectedLayers)
  return layers
}
