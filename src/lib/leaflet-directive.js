import layerFactory from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'

let map
let currentLayers = []

export default {
  bind (el, { value }) {
    let { config, callbacks } = value
    map = mapFactory(el, config)
    callbacks.initMapObject(map)
  },
  update (_, { value, oldValue }) {
    if (value === oldValue) {
      return
    }

    const { mapLayers, callbacks } = value

    const newCurrentLayers = mapLayers
      .map(layer => layerFactory(layer, callbacks))
      .map(layer => {
        map.addLayer(layer)
        return layer
      })

    if (currentLayers.length) {
      currentLayers.forEach(layer => map.removeLayer(layer))
      currentLayers = []
    }

    currentLayers = newCurrentLayers
  }
}
