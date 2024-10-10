import mapConfig from '../map.config.js'

export default async function getCombinedFeatureInfo ({ lat, lng, selectedLayer }) {
  const band = selectedLayer?.metadata?.band
  const imageId = selectedLayer?.metadata?.data_id

  if (!band || !imageId) {
    return []
  }

  const services = await mapConfig.getServices()

  const body =  JSON.stringify({
      imageId,
      bbox: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      band
    })


  return fetch( `${services.HYDRO_ENGINE_URL}/get_feature_info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
    .then(json => Object.values(json))
    .catch(() => undefined)
}
