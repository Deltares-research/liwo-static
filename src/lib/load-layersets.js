import _ from 'lodash'

const apiBase = 'https://basisinformatie-overstromingen.nl/liwo.ws'
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

// TODO: where do we need this.
// function afterTheDash (text) {
//   // if there is a dash in the text, return the part after the text
//   let result = text
//   let parts = text.split(' - ')
//   if (Array.isArray(parts)) {
//     result = parts[parts.length - 1]
//   }
//   return result
// }

// A semantic issue, is it layer set or layerset.
// layer set is probably more correct but
// the single word version is more common in technical context
// see for example dataset vs data set.
// anyway it's not even a set, it's just a list, so just layers would suffice
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function cleanupLayerset (data) {
  // ok, here we go, we have an object structure that is nested 7 levels deep and we're gonna flatten it...
  // The hierarchy is (in jq format):
  // d.layerset.layers[0].variants[0].map

  // let's restructure this to something that matches with leaflet terminology
  // because we're going to make a map
  // map -> (GeoJSON, TileLayer)
  // variants -> LayerGroup
  // layerset -> Map (a collection of layers/layergroups)

  let layerGroups = []
  // we'll reference everything with flat... to avoid confusion
  // convert a layerset object to a flat list of layers
  data.layerset.layers.map(layersetLayer => {
    let layers = []
    layersetLayer.variants.map(layersetLayerVariant => {
      // ok now get the relevant information
      // we have two types of layers
      // GeoJSON {geojson, properties}
      // TileLayer {url, properties}
      // relevant things in properties:
      // id (should be unique over all layers)
      // data does not have any properties other than layerset
      let layer = {
        // TODO, this would be a good place to put the geojson or map url
        properties: layersetLayerVariant
      }
      layers.push(layer)
    })
    let layerGroup = {
      properties: _.omit(layersetLayer, ['variants']),
      layers: layers
    }
    layerGroups.push(layerGroup)
  })

  let map = {
    properties: _.omit(data.layerset, ['layers']),
    layerGroups
  }
  return map
}

export function loadMapById (id) {
  const body = JSON.stringify({ id })
  const url = `${apiBase}/Maps.asmx/GetLayerSet`
  // this is called init in fetch terminology
  const init = {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  }
  const response = fetch(url, init)
    .then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(cleanupLayerset)
    .catch(() => ([]))
  return response
}

export function loadLayersets () {
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
  loadMapById,
  loadLayersets
}
