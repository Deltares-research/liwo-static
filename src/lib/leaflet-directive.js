import layerFactory from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'
import L from '@/lib/leaflet-utils/leaf'

let map
let layerGroup
// TODO: replace  this with vue2-leaflet
// see vue docs
// https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-the-Parent-Component-Instance
export default {
  bind (el, { value }) {
    let { config, callbacks } = value
    map = mapFactory(el, config)
    layerGroup = L.layerGroup().addTo(map)
    callbacks.initMapObject(map)
  },
  update (_, { value, oldValue }) {
    if (value === oldValue) {
      return
    }

    const { mapLayers: _mapLayers, callbacks, cluster } = value
    const mapLayers = _mapLayers.filter(value => value)

    layerGroup.clearLayers()

    mapLayers
      .filter(layer => !layer.hide)
      .map(layer => layerFactory(layer, callbacks, cluster))
      .filter(layer => layer)
      .forEach(layer => layerGroup.addLayer(layer))
  }
}
