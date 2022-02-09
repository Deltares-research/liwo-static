export function getLayerInfoValue (data, layerId, selectedLayer) {
  // we have three variants of how the properties can be returned
  // as a value in gray_index
  if (data && data.properties && data.properties.GRAY_INDEX) {
    return data.properties.GRAY_INDEX
  } else if (data && data.properties && data.properties[layerId]) {
    // as a value in the layer property
    return data.properties[layerId]
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
          return data.properties[key]
        }
      }
    }
  }

  return null
}
