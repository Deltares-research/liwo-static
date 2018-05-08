const body = JSON.stringify({ username: '', password: '', mode: '' })
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export default async function loadLayersets () {
  return fetch('https://basisinformatie-overstromingen.nl/liwo.ws/Authentication.asmx/Login', {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  }).then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => data.layersets)
    .catch(() => ([]))
}
