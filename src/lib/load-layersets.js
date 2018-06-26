import _ from 'lodash'

// casing similar to JSON
import loadGeoJSON from '@/lib/load-geojson'

const apiBase = 'https://basisinformatie-overstromingen.nl/liwo.ws'
const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

function afterTheLastDash (text) {
  // if there are dashes in the text, return the part after the last dash
  let result = _.last(
    _.split(text, ' - ')
  )
  return result
}

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
    layersetLayer.variants.map(async layersetLayerVariant => {
      // ok now get the relevant information
      // we have two types of layers
      // GeoJSON {geojson, properties}
      // TileLayer {url, properties}
      // relevant things in properties:
      // id (should be unique over all layers)
      // data does not have any properties other than layerset
      let layer = {
        properties: layersetLayerVariant
      }
      // pass along the map, which contains info about the layer.
      layer.geojson = await loadGeoJSON(layer.properties.map)
      if (_.get(layersetLayerVariant, 'map.type', '') === 'WMS') {
        // TODO: get map layer
        layer.layers = _.get(layersetLayerVariant, 'map.layer')
        // TODO: singular plural
        layer.styles = _.get(layersetLayerVariant, 'map.style')
      }

      layers.push(layer)
    })
    let layerGroupProperties = _.omit(layersetLayer, ['variants'])
    // for some reason this id is not named id
    layerGroupProperties.id = layerGroupProperties.layer_id
    // use the last name in the - separated list of dashes
    layerGroupProperties.title = afterTheLastDash(layerGroupProperties.name)
    let layerGroup = {
      properties: layerGroupProperties,
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
