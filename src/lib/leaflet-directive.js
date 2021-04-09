import deepEqual from 'deep-equal'
import { isPromise } from '@/lib/utils'
import L from '@/lib/leaflet-utils/leaf'
import createLayer from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'

let map
let layerGroup
// TODO: replace  this with vue2-leaflet
// see vue docs
// https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-the-Parent-Component-Instance
export default {
  bind (el, { value }, vnode) {
    const { config, callbacks } = value
    map = mapFactory(el, vnode, config)
    layerGroup = L.layerGroup().addTo(map)
    callbacks.initMapObject(map)
  },
  update (_, { value, oldValue }) {
    if (deepEqual(value, oldValue)) {
      return
    }
    // TODO: use vue2-leaflet so we don't have to pass a magic  attribute

    const { callbacks, cluster } = value
    // TODO: why? remove falsy values?
    const layers = value.layers.filter(value => value)

    layerGroup.clearLayers()

    const leafletLayers = layers
      .filter(layer => !layer.hide)

    leafletLayers
      .map(layer => createLayer(layer, callbacks, cluster))
      .filter(layer => layer)
      .forEach(async layer => {
        if (isPromise(layer)) {
          layer = await layer
        }

        layerGroup.addLayer(layer)
      })
  }
}
