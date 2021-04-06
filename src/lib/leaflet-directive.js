import createLayer from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'
import L from '@/lib/leaflet-utils/leaf'

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
    if (value === oldValue) {
      return
    }
    // TODO: use vue2-leaflet so we don't have to pass a magic  attribute

    const { callbacks, cluster } = value
    // TODO: why? remove falsy values?
    const layers = value.layers.filter(value => value)

    layerGroup.clearLayers()

    const leafletLayers = layers
      .filter(layer => !layer.hide)

    const promises = leafletLayers
      .map(layer => {
        const promise = createLayer(layer, callbacks, cluster)
        return promise
      })

    // wait for all layers to be created and then add them to the group
    Promise.all(promises)
      .then((leafletLayers) => {
        // add leafletLayers to the L.layerGroup
        leafletLayers
          .filter(layer => layer)
          .forEach(layer => layerGroup.addLayer(layer))
      })
  }
}
