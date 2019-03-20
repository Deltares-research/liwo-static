import includes from 'lodash/fp/includes'
import first from 'lodash/fp/first'

const defaultRouteName = 'viewer'
const mapping = {
  'combine': [33],
  'combined': [34]
}

export function getRouteNameByLayerSet (setId) {
  const routeName = Object.keys(mapping).reduce((found, key) => {
    return includes(setId, mapping[key])
      ? key
      : found
  }, defaultRouteName)

  return routeName
}

export function getFirstLayerSetForRoute (routeName, fallback) {
  const array = mapping[routeName] || [fallback]
  return first(array)
}

export default mapping
