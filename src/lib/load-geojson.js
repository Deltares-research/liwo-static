
async function getFeatures(url, jsonLayer ) {
  const resp = await fetch(url, { mode: 'cors' })
  const geojson = await resp.json()

  geojson.features = geojson.features.map(feature => {
    feature.properties.isControllable = !!jsonLayer.iscontrollayer
    feature.properties.icon = 'default'
    return feature
  })

  return geojson
}

/**
 * Loads the geojson for a given layer if it is of type json or cluster.
 * @returns {Promise<GeoJSON|null>}
 */
export async function loadGeojson (jsonLayer) {
  /**
   * If the layer is not of type json or cluster
   * we can assume it does not have a geojson to load
   * and return the layer as is
   */
  if (!['json', 'cluster'].includes(jsonLayer.type)) {
    return Promise.resolve(null)
  }

  const url = `/data/${jsonLayer.layer.replace(/^gebiedsindeling_/, '')}.json`
  const result = await getFeatures(url, jsonLayer)

  return result
}
