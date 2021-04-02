import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'

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
      let value = null

      // we have three variants of how the properties can be returned
      // as a value in gray_index
      if (data && data.properties && data.properties.GRAY_INDEX) {
        value = data.properties.GRAY_INDEX
      } else if (data && data.properties && data.properties[layerId]) {
        // as a value in the layer property
        value = data.properties[layerId]
      } else if (data && data.properties) {
        // This is the case where featureInfo returns information on multiple bands at once.

        // We don't have the current band available other then the breachBandId
        // We need to lookup the band and present the correct property based on the current band

        // multiple properties but we don't know what they contain
        // lookup selected band
        const parts = selectedLayer.breachBandId.split('_')
        // pick the last element
        const band = parts.pop()
        if (band.toLowerCase().startsWith('band')) {
          // we have a band
          let key
          for (key of Object.keys(data.properties)) {
            if (key.toLowerCase() === band.toLowerCase()) {
              // found it....
              value = data.properties[key]
            }
          }
        }
      }

      if (value !== null) {
        value = value.toFixed(1)

        L.popup()
          .setLatLng(latlng)
          .setContent(`${value} [${unit}]`)
          .openOn(map)
      }
    })
}
