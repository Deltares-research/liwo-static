import mapConfig from '../map.config'

const BREACHES_API_PATH = 'Tools/FloodImage.asmx/GetScenariosPerBreach'
const BREACHES_ENDPOINT = `${mapConfig.services.WEBSERVICE_URL}${BREACHES_API_PATH}`

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export default function (breachid, breachName) {
  return fetch(BREACHES_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify({
      breachid,
      layername: 'stroomsnelheid'
    })
  })
    .then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => ({ ...data[0].layerset[0], selected: false, breachName }))
}
