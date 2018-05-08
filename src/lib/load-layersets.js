const apiBase = 'https://basisinformatie-overstromingen.nl/liwo.ws'
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export async function loadLayersetById (id) {
  const body = JSON.stringify({ id })
  return fetch(`${apiBase}/Maps.asmx/GetLayerSet`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  }).then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => data.layerset)
    .catch(() => ([]))
}

export async function loadLayersets () {
  const body = JSON.stringify({ username: '', password: '', mode: '' })
  return fetch(`${apiBase}/Authentication.asmx/Login`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  }).then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => data.layersets)
    .catch(() => ([]))
}

export default {
  loadLayersetById,
  loadLayersets
}
