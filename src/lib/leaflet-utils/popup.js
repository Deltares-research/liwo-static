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

export async function showCombinedLayerInfoPopup ({ coordinates, map }) {
  const services = await mapConfig.getServices()
  const HYDRO_ENGINE_URL = services.HYDRO_ENGINE_URL
  const { lat, lng } = coordinates
  const url = `${HYDRO_ENGINE_URL}/get_feature_info`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageId: 'projects/dgds-gee/glossis/waterlevel/glossis_waterlevel_20200301000000',
      bbox: {
        type: 'Point',
        coordinates: [lat, lng]
      },
      band: 'water_level_surge'
    })
  }

  fetch(url, options)
    .then(response => response.json())
    .then(({ value }) => {
      if (value !== null) {
        const content = value.toString()
        L.popup()
          .setLatLng(coordinates)
          .setContent(content)
          .openOn(map)
      }
    })
    .catch(error => console.log('error', error))
}
