import { BREACH_PRIMARY, BREACH_REGIONAL } from '@/lib/liwo-identifiers'
import mapConfig from '../map.config'

const BREACHES_BASE_URL = mapConfig.services.WEBSERVICE_URL
const BREACHES_API_URL_PRIMARY = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreach`
const BREACHES_API_URL_REGIONAL = `${BREACHES_BASE_URL}/Tools/FloodImage.asmx/GetScenariosPerBreachRegional`

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
const breachLayers = [
  'waterdiepte',
  'stroomsnelheid',
  'stijgsnelheid',
  'schade',
  'slachtoffers'
]

export default function (breachId, layerType) {
  if (layerType === BREACH_REGIONAL) {
    return loadRegionalBreachLayer(breachId, `${BREACH_REGIONAL}.${breachId}`)
  } else if (layerType === BREACH_PRIMARY) {
    return Promise.all(breachLayers.map(layerName => loadBreachLayer(breachId, layerName)))
      .then(layers => {
        return {
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
  return fetch(BREACHES_API_URL_PRIMARY, {
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

fetch("http://tw-160.xtr.deltares.nl/liwo.ws/Tools/FloodImage.asmx/GetScenariosPerBreach", {"credentials":"omit","headers":{"content-type":"application/json"},"referrer":"http://example.com/","referrerPolicy":"no-referrer-when-downgrade","body":"{\"breachid\":66,\"layername\":\"waterdiepte\"}","method":"POST","mode":"cors"});

function loadRegionalBreachLayer (breachid, gid) {
  return fetch(BREACHES_API_URL_REGIONAL, {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify({
      breachid,
      gid
    })
  })
    .then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch()
}
