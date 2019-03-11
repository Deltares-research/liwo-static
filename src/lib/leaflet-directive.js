import layerFactory from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'
import L from './leaflet-utils/leaf'
import getFeatureInfo from './get-feature-info'

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

    map.on('click', e => {
      if (newCurrentLayers.length) {
        const layer = newCurrentLayers[0]
        const bounds = map.getBounds()

        getFeatureInfo({
          ne: bounds._northEast,
          sw: bounds._southWest,
          x: e.containerPoint.x,
          y: e.containerPoint.y,
          width: map._size.x,
          height: map._size.y,
          layer: layer.options.layers
        })
          .then(d => {
            let value

            if (d && d.properties.GRAY_INDEX && d.properties.GRAY_INDEX > -999.00) {
              value = d.properties.GRAY_INDEX.toFixed(2)
            }

            if (value) {
              L.popup()
                .setLatLng(e.latlng)
                .setContent(value)
                .openOn(map)
            }
          })
      }
    })

    if (currentLayers.length) {
      currentLayers.forEach(layer => map.removeLayer(layer))
      currentLayers = []
    }

    currentLayers = newCurrentLayers
  }
}
