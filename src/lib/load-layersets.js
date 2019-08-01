import _ from 'lodash'

import mapConfig from '../map.config.js'
import { loadGeojson } from './load-geojson'

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

export async function loadLayerSetById (id, options) {
  const body = JSON.stringify({ id })

  let services = await mapConfig.getServices()
  const apiBase = services.WEBSERVICE_URL
  let layerSet = await fetch(`${apiBase}/Maps.asmx/GetLayerSet`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  })
    .then(
      res => res.json()
    )
    .then(
      data => JSON.parse(data.d)
    )
    .then(
      data => data.layerset
    )
    .catch((error) => {
      console.error(`Error fetching the layerSets: ${error}`)
      return []
    })

  // Load (this method)

  // then:
  //    -> flatten ??
  //    -> validate
  //    -> clean (layer-parser)
  //    -> ammend

  // TODO: Only load data, don't clean yet
  // TODO: check if we have a layerSet or layer
  //
  let title = layerSet.name || layerSet.title
  layerSet = {
    ...layerSet,
    title: title,
    layers: layerSet.layers.map(layer => {
      const id = layer.layer_id || layer.id
      const nameSplit = layer.name.split(' - ')
      // TODO: move to cleanup
      const title = (Array.isArray(nameSplit)) ? nameSplit[nameSplit.length - 1] : layer.name
      // if we don't have geojson we're done
      return {
        ...layer,
        id,
        title
      }
    })
  }

  // we got a deeply nested structure here
  // layerSet.layers[].variants[].map.geojson is what we're looking for
  // TODO: flatten to:
  // layer { geojson?, ...map, ...variant, ...layer, ...layerSet }
  // rename layerSet to map
  // in view group layer on variants using L.layergroups
  // TODO: we could consider returning data without the promise.all
  // that would respond a bit faster but now we show all data at once.

  let layers = await Promise.all(
    layerSet.layers.map(async (layer) => {
      let variants = await Promise.all(
        layer.variants.map(async (variant) => {
          if (_.includes(['json', 'cluster'], variant.map.type)) {
            let geojson = await loadGeojson(variant.map)
            variant.map.geojson = geojson
          }
          return variant
        })
      )
      layer.variants = variants
      return layer
    })
  )
  layerSet.layers = layers

  return layerSet
}

export async function loadLayerSets () {
  // we don't need to login anymore, but the function is still used to
  // get the list of public maps
  const body = JSON.stringify({
    username: 'anonymous@rws.nl',
    password: '',
    mode: ''
  })
  let services = await mapConfig.getServices()
  const apiBase = services.WEBSERVICE_URL
  return fetch(`${apiBase}/Authentication.asmx/Login`, {
    method: 'POST',
    mode: 'cors',
    headers,
    body
  }).then(res => res.json())
    .then(data => JSON.parse(data.d))
    .then(data => data.layersets)
}

export function extractUnit (title) {
  return title.split('[').pop().split(']')[0]
}

export default {
  loadLayerSetById,
  loadLayerSets
}
