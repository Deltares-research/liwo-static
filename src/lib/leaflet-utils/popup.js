import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'

export function showLayerInfoPopup ({ map, activeLayer, layerUnits, position, latlng }) {
  const bounds = map.getBounds()
  const { layer, layerId } = activeLayer
  const unit = layerUnits[layerId]

  getFeatureInfo({
    bounds,
    x: position.x,
    y: position.y,
    width: map._size.x,
    height: map._size.y,
    layer
  })
    .then(data => {
      let value

      if (data && data.properties && data.properties.GRAY_INDEX && data.properties.GRAY_INDEX > -999.00) {
        value = data.properties.GRAY_INDEX.toFixed(2)
      }

      if (value) {
        L.popup()
          .setLatLng(latlng)
          .setContent(`${value} [${unit}]`)
          .openOn(map)
      }
    })
}
