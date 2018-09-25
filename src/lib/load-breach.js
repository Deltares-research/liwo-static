import mapConfig from '../map.config'

const BREACHES_BASE_URL = mapConfig.services.WEBSERVICE_URL
const BREACHES_API_URL_PRIMARY = `${BREACHES_BASE_URL}Tools/FloodImage.asmx/GetScenariosPerBreach`
const BREACHES_API_URL_REGIONAL = `${BREACHES_BASE_URL}Tools/FloodImage.asmx/GetScenariosPerBreachRegional`

const BREACH_TYPE_PRIMARY = 'geo_doorbraaklocaties_primair'
const BREACH_TYPE_REGIONAL = 'geo_doorbraaklocaties_regionaal'

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
const breachLayers = [
  'waterdiepte',
  'stroomsnelheid',
  'stijgsnelheid',
  'schade',
  'slachtoffers'
]

export default function (breachId, layerType) {
  if (layerType === BREACH_TYPE_REGIONAL) {
    return loadRegionalBreachLayer(breachId, `${BREACH_TYPE_REGIONAL}.${breachId}`)
  } else if (layerType === BREACH_TYPE_PRIMARY) {
    return Promise.all(breachLayers.map(layerName => loadBreachLayer(breachId, layerName)))
      .then(layers => {
        return {
          layers: layers.reduce((breachLayers, layer) => {
            return [ ...breachLayers, ...layer.layers ]
          }, [])
        }
      })
  }
}

function loadBreachLayer (breachid, layername, layertype) {
  return fetch(BREACHES_API_URL_PRIMARY, {
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
