import { stringify } from 'query-string'
import mapConfig from '../map.config.js'

export default async function ({
  url,
  service,
  request,
  encode = true,
  width = 256,
  height = 256,
  ...rest
}) {
  if (!service || !request) {
    return undefined
  }
  const services = await mapConfig.getServices()
  const params = stringify({
    service,
    request,
    width,
    height,
    ...rest
  }, { encode, sort: false })

  return `${url || services.STATIC_GEOSERVER_URL}?${params}`
}
