import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'

export function showLayerInfoPopup ({ map, activeLayer, unit, position, latlng }) {
  const bounds = map.getBounds()

  getFeatureInfo({
    bounds,
    x: position.x,
    y: position.y,
    width: map._size.x,
    height: map._size.y,
    layer: activeLayer
  })
    .then(data => {
      let value

      if (data && data.properties && data.properties.GRAY_INDEX) {
        value = data.properties.GRAY_INDEX
      }

      if (data && data.properties && data.properties[activeLayer]) {
        value = data.properties[activeLayer]
      }

      if (value) {
        value = value.toFixed(1)

        L.popup()
          .setLatLng(latlng)
          .setContent(`${value} [${unit}]`)
          .openOn(map)
      }
    })
}
