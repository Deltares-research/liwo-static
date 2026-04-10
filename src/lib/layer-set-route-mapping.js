const defaultRouteName = 'viewer'
const mapping = {
  combine: [33],
  combined: [34]
}

export function getRouteNameByLayerSet (setId) {
  const routeName = Object.keys(mapping).reduce((found, key) => {
    return mapping[key].includes(setId)
      ? key
      : found
  }, defaultRouteName)

  return routeName
}

export function getFirstLayerSetForRoute (routeName, fallback) {
  const array = mapping[routeName] || [fallback]
  return array[0]
}

export default mapping
