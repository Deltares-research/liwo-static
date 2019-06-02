export const BREACH_PREFIX = 'geo_doorbraaklocaties'
export const BREACH_PRIMARY = 'geo_doorbraaklocaties_primair'
export const BREACH_REGIONAL = 'geo_doorbraaklocaties_regionaal'
export const BREACH_OUTSIDE_DIKE = 'geo_scenariolocaties_buitendijks'
export const BREACH_FLOODING = 'geo_scenariolocaties_wateroverlast'
export const BREACH_SELECTED = 'selected_marker'
export const BREACHES_PRIMARY_LAYER_ID = 'geo_doorbraaklocaties_primair'
export const BREACHES_REGIONAL_LAYER_ID = 'geo_doorbraaklocaties_regionaal'

export function getLayerType (feature) {
  // Also works for layer argument
  // get the layer type based on the feature id (assuming the format BREACH_LAYER.ID)
  const re = new RegExp(`${BREACH_PRIMARY}|${BREACH_REGIONAL}|${BREACH_OUTSIDE_DIKE}|${BREACH_FLOODING}`)
  let match = feature.id.match(re)
  // if we have match return the matched part
  let result = match ? match[0] : ''
  return result
}

export function hasProbabilities (layer) {
  // return true if  layer type matches BREACH_PREFIX
  let layerType = getLayerType(layer)
  let result = layerType.startsWith(BREACH_PREFIX)
  return result
}

export const BREACHES_IDS = [
  BREACH_PRIMARY,
  BREACH_REGIONAL,
  BREACH_OUTSIDE_DIKE,
  BREACH_FLOODING,
  BREACH_SELECTED
]
