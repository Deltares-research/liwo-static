import _ from 'lodash'

import { BREACH_PRIMARY, BREACH_REGIONAL, getLayerType } from '@/lib/liwo-identifiers'
import mapConfig from '../map.config'

const BREACHES_BASE_URL = mapConfig.services.WEBSERVICE_URL
const BREACHES_API_URL = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreachGeneric`

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

// Load breach data from the geoserver
export default async function (feature) {
  // the breach id is hidden here
  let breachId = feature.properties.id

  // TODO: there's also a code PRIM, should we not use that?
  let layerType = getLayerType(feature)

  // we have different breach layers, depending on the type
  let breachLayers = []
  if (layerType === BREACH_REGIONAL) {
    breachLayers = [`${BREACH_REGIONAL}.${breachId}`]
  } else if (layerType === BREACH_PRIMARY) {
    breachLayers = [
      'waterdiepte',
      'stroomsnelheid',
      'stijgsnelheid',
      'schade',
      'slachtoffers'
    ]
  }

  let promises = breachLayers.map(
    layerName => loadBreachLayer(breachId, layerName)
  )

  // the layers are a bit out of order, so restructure them
  // TODO: consider making this async, otherwise we lock the browser
  let bands = await Promise.all(promises)
  // remove undefined bands
  bands = _.filter(bands)

  // merge layers of all unorganized sets
  // and use the feature name
  let layers = _.flatten(_.map(bands, 'layers'))
  let layerSet = {
    id: breachId,
    feature: feature,
    name: feature.properties.naam,
    title: feature.properties.naam,
    layers: layers
  }
  return layerSet
}

function loadBreachLayer (breachid, layername) {
  // Load the dataset  for a breach
  return fetch(BREACHES_API_URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers,
    body: JSON.stringify({
      breachid,
      layername
    })
  })
    .then(res => res.json())
  // get rid of some ASP  fluff
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch(() => undefined)
}
