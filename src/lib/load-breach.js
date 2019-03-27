import { BREACH_PRIMARY, BREACH_REGIONAL } from '@/lib/liwo-identifiers'
import mapConfig from '../map.config'

const BREACHES_BASE_URL = mapConfig.services.WEBSERVICE_URL
const BREACHES_API_URL = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreachGeneric`
const COMBINE = 'combine'
const COMBINED = 'combined'

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export default function (breachId, layerType, viewerType) {
  let breachLayers
  if (viewerType === COMBINE || viewerType === COMBINED) {
    breachLayers = ['waterdiepte']
  } else {
    breachLayers = [
      'waterdiepte',
      'stroomsnelheid',
      'stijgsnelheid',
      'schade',
      'slachtoffers'
    ]
  }

  if (layerType === BREACH_REGIONAL) {
    return loadBreachLayer(breachId, `${BREACH_REGIONAL}.${breachId}`)
  } else if (layerType === BREACH_PRIMARY) {
    return Promise.all(breachLayers.map(layerName => loadBreachLayer(breachId, layerName)))
      .then(layers => {
        return {
          // do not load layers in 'combined' viewerType
          layers: layers
            .filter(layer => layer !== undefined)
            .reduce((breachLayers, layer) => {
              return [ ...breachLayers, ...layer.layers ]
            }, [])
        }
      })
  }
}

function loadBreachLayer (breachid, layername) {
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
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch(() => undefined)
}
