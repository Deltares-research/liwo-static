import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'
import { getLayerInfoValue } from './get-layer-info-value'

import mapConfig from '../../map.config.js'

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

export async function showCombinedLayerInfoPopup ({ coordinates, layer, map }) {
  const band = layer.variants[0].metadata.band
  const imageId = layer.variants[0].metadata.data_id
  const services = await mapConfig.getServices()
  const HYDRO_ENGINE_URL = services.HYDRO_ENGINE_URL
  const { lat, lng } = coordinates
  const url = `${HYDRO_ENGINE_URL}/get_feature_info`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageId,
      bbox: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      band
    })
  }

  fetch(url, options)
    .then(response => response.json())
    .then((json) => {
      const value = Object.values(json)
      const content = value[0] ? value[0].toFixed(2).toString() : 'Geen data beschikbaar'

      L.popup()
        .setLatLng(coordinates)
        .setContent(content)
        .openOn(map)
    })
    .catch(error => console.log('error', error))
}
