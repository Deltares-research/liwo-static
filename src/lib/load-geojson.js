
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

export async function loadGeojson (jsonLayer, layerSetId) {
  // no json, nothing to do
  if (!['json', 'cluster'].includes(jsonLayer.type)) {
    return Promise.resolve(jsonLayer)
  }

  const url = `/data/${jsonLayer.layer.replace(/^gebiedsindeling_/, '')}.json`
  const result = await getFeatures(url, jsonLayer, layerSetId)

  return result
}
