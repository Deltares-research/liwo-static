import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'
import { getLayerInfoValue } from './get-layer-info-value'

export function showLayerInfoPopup ({ map, layerId, unit, selectedLayer, position, latlng }) {
  const bounds = map.getBounds()

  getFeatureInfo({
    bounds,
    x: position.x,
    y: position.y,
    width: map._size.x,
    height: map._size.y,
    layer: layerId
  })
    .then(data => {
      const value = getLayerInfoValue(data, layerId, selectedLayer)

      if (value !== null) {
        const formattedValue = value.toFixed(1)

        L.popup()
          .setLatLng(latlng)
          .setContent(`${formattedValue} [${unit}]`)
          .openOn(map)
      }
    })
}
