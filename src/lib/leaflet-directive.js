import layerFactory from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'

let map
let currentLayers = []

export default {
  bind (el, { value }) {
    const { config } = value
    map = mapFactory(el, config)
  },
  update (_, { value, oldValue }) {
    if (value === oldValue) {
      return
    }

    const { mapLayers, callbacks } = value
    console.log('MAPLAYERS', mapLayers)

    if (currentLayers.length) {
      currentLayers.forEach(layer => map.removeLayer(layer))
      currentLayers = []
    }

    mapLayers
      .map(layer => layerFactory(layer, callbacks))
      .forEach(layer => {
        map.addLayer(layer)
        currentLayers.push(layer)
      })
  }
}
