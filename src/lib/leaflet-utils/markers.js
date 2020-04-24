import L from '@/lib/leaflet-utils/leaf'

import { BREACH_PRIMARY, BREACH_REGIONAL, BREACH_OUTSIDE_DIKE, BREACH_FLOODING, BREACH_WATERSYSTEM } from '@/lib/liwo-identifiers'

import blackIconUrl from '../../img/markers/marker-icon-black.png'
import blackRetinaIconUrl from '../../img/markers/marker-icon-2x-black.png'
import greenIconUrl from '../../img/markers/marker-icon-green.png'
import greenRetinaIconUrl from '../../img/markers/marker-icon-2x-green.png'
import iconShadowUrl from '../../img/markers/marker-shadow.png'
import redIconUrl from '../../img/markers/marker-icon-red.png'
import redRetinaIconUrl from '../../img/markers/marker-icon-2x-red.png'

// disable camelcase warning because we want to separate numbers
/* eslint camelcase: 0 */
import icon_30_60_60_url from '../../img/markers/1x/30-60-60.png'
import icon_120_60_60_url from '../../img/markers/1x/120-60-60.png'
import icon_180_60_60_url from '../../img/markers/1x/180-60-60.png'
import icon_210_60_60_url from '../../img/markers/1x/210-60-60.png'
import icon_300_60_60_url from '../../img/markers/1x/300-60-60.png'
import icon_30_60_60_retinaUrl from '../../img/markers/2x/30-60-60@2x.png'
import icon_120_60_60_retinaUrl from '../../img/markers/2x/120-60-60@2x.png'
import icon_180_60_60_retinaUrl from '../../img/markers/2x/180-60-60@2x.png'
import icon_210_60_60_retinaUrl from '../../img/markers/2x/210-60-60@2x.png'
import icon_300_60_60_retinaUrl from '../../img/markers/2x/300-60-60@2x.png'
/* eslint camelcase: 2 */

export const defaultIcon = new L.Icon.Default()

const iconDefaults = {
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
}

export const blackIcon = L.icon({
  iconUrl: blackIconUrl,
  iconRetinaUrl: blackRetinaIconUrl,
  ...iconDefaults
})

export const greenIcon = L.icon({
  iconUrl: greenIconUrl,
  iconRetinaUrl: greenRetinaIconUrl,
  ...iconDefaults
})

export const redIcon = L.icon({
  iconUrl: redIconUrl,
  iconRetinaUrl: redRetinaIconUrl,
  ...iconDefaults
})

/* eslint camelcase: 0 */
export const icon_30_60_60 = L.icon({
  iconUrl: icon_30_60_60_url,
  iconRetinaUrl: icon_30_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_120_60_60 = L.icon({
  iconUrl: icon_120_60_60_url,
  iconRetinaUrl: icon_120_60_60_retinaUrl,
  ...iconDefaults
})
export const icon_180_60_60 = L.icon({
  iconUrl: icon_180_60_60_url,
  iconRetinaUrl: icon_180_60_60_retinaUrl,
  ...iconDefaults
})
export const icon_210_60_60 = L.icon({
  iconUrl: icon_210_60_60_url,
  iconRetinaUrl: icon_210_60_60_retinaUrl,
  ...iconDefaults
})
export const icon_300_60_60 = L.icon({
  iconUrl: icon_300_60_60_url,
  iconRetinaUrl: icon_300_60_60_retinaUrl,
  ...iconDefaults
})
/* eslint no-use-before-define: 2 */

export const iconsByLayerType = {
  [BREACH_PRIMARY]: icon_210_60_60,
  [BREACH_REGIONAL]: icon_120_60_60,
  [BREACH_OUTSIDE_DIKE]: icon_30_60_60,
  [BREACH_FLOODING]: icon_180_60_60,
  [BREACH_WATERSYSTEM]: icon_300_60_60,

  default: defaultIcon
}
