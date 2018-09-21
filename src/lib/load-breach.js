import mapConfig from '../map.config'

const BREACHES_API_PATH = 'Tools/FloodImage.asmx/GetScenariosPerBreach'
const BREACHES_ENDPOINT = `${mapConfig.services.WEBSERVICE_URL}${BREACHES_API_PATH}`

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
const breachLayers = [
  'waterdiepte',
  'stroomsnelheid',
  'stijgsnelheid',
  'schade',
  'slachtoffers'
]

export default function (breachid) {
  return Promise.all(breachLayers.map(layername => loadBreachLayer(breachid, layername)))
    .then(layers => {
      return {
        layers: layers.reduce((breachLayers, layer) => {
          return [ ...breachLayers, ...layer.layers ]
        }, [])
      }
    })
}

function loadBreachLayer (breachid, layername) {
  return fetch(BREACHES_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify({
      breachid,
      layername
    })
  })
    .then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0] }))
    .catch()
}
