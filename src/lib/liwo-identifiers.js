export const BREACH_PREFIX = 'gebiedsindeling_doorbraaklocaties'
export const BREACH_PRIMARY = BREACH_PREFIX + '_primair'
export const BREACH_REGIONAL = BREACH_PREFIX + '_regionaal'
export const BREACH_OUTSIDE_DIKE = BREACH_PREFIX + '_buitendijks'
export const BREACH_FLOODING = BREACH_PREFIX + '_wateroverlast'
export const BREACH_WATERSYSTEM = BREACH_PREFIX + '_regionaalwatersysteem'
export const BREACH_SELECTED = 'selected_marker'
export const BREACHES_PRIMARY_LAYER_ID = 'gebiedsindeling_doorbraaklocaties_primair'
export const BREACHES_REGIONAL_LAYER_ID = 'gebiedsindeling_doorbraaklocaties_regionaal'

export function getLayerType (feature) {
  // Also works for layer argument
  // get the layer type based on the feature id (assuming the format BREACH_LAYER.ID)
  // the breach prefix followed by a number of letters and or underscores
  const re = new RegExp(`${BREACH_PREFIX}[\\w_]+`)
  let match = feature.id.match(re)
  // if we have match return the matched part
  let result = match ? match[0] : ''
  if (feature.properties.missing) {
    result = 'missing'
  }
  return result
}

export function hasProbabilities (layer) {
  // return true if  layer type matches BREACH_PREFIX
  let layerType = getLayerType(layer)
  let result = layerType.startsWith(BREACH_PREFIX)
  return result
}

// translation table for breach layers
export const BREACH_LAYERS_EN = {
  'waterdepth': 'waterdiepte',
  'velocity': 'stroomsnelheid',
  'riserate': 'stijgsnelheid',
  'damage': 'schade',
  'fatalities': 'slachtoffers',
  'affected': 'getroffenen',
  'arrivaltime': 'aankomsttijd'

}

export const BREACH_LAYERS_NL = [
  'waterdiepte',
  'stroomsnelheid',
  'stijgsnelheid',
  'schade',
  'slachtoffers',
  'getroffenen',
  'aankomsttijd'
]

export const BREACHES_IDS = [
  BREACH_PRIMARY,
  BREACH_REGIONAL,
  BREACH_OUTSIDE_DIKE,
  BREACH_FLOODING,
  BREACH_WATERSYSTEM,
  BREACH_SELECTED
]
