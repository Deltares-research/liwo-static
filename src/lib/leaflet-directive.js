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
  update (_, { value, oldValue }, vnode) {
    // check if of one of the layers the opacity changed
    const changedOpacityLayers = value.layers.filter((layer) => {
      const oldLayer = oldValue.layers.find(oldLayer => oldLayer.layerObj.id === layer.layerObj.id)

      if (oldLayer) {
        const opacity = layer.layerObj.properties.opacity
        const oldOpacity = oldLayer.layerObj.properties.opacity

        return opacity !== oldOpacity
      } else {
        return false
      }
    })

    // manually change opacity of the layers where opacity changed
    // (this is very specific behaviour, but it improves the UX so much that it's worth it)
    if (changedOpacityLayers.length) {
      changedOpacityLayers.forEach(layer => {
        const mapLayer = layerGroup.getLayers().find(l => l.options.layers === layer.layer)
        mapLayer.setOpacity(layer.layerObj.properties.opacity)
      })

      return
    }

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
      .map(layer => createLayer(layer, callbacks, cluster, vnode))
      .filter(layer => layer)
      .forEach(async layer => {
        if (isPromise(layer)) {
          layer = await layer
        }

        layerGroup.addLayer(layer)
      })
  }
}
