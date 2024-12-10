import L from '@/lib/leaflet-utils/leaf'

import { BREACH_PRIMARY, BREACH_REGIONAL, BREACH_OUTSIDE_DIKE, BREACH_FLOODING, BREACH_WATERSYSTEM } from '@/lib/liwo-identifiers'

import blackIconUrl from '../../img/markers/marker-icon-black.png'
import blackRetinaIconUrl from '../../img/markers/marker-icon-2x-black.png'
import greenIconUrl from '../../img/markers/marker-icon-green.png'
import greenRetinaIconUrl from '../../img/markers/marker-icon-2x-green.png'
import iconShadowUrl from '../../img/markers/marker-shadow.png'
import redIconUrl from '../../img/markers/marker-icon-red.png'
import redRetinaIconUrl from '../../img/markers/marker-icon-2x-red.png'
import yellowIconUrl from '../../img/markers/marker-icon-yellow.png'
import yellowRetinaIconUrl from '../../img/markers/marker-icon-2x-yellow.png'

// disable camelcase warning because we want to separate numbers
// The numbers refer to hue saturation and  lightness.
// See the markers.svg source in the src/img/design folder

/* eslint camelcase: 0 */
import icon_0_0_60_url from '../../img/markers/1x/0-0-60.png'
import icon_0_60_60_url from '../../img/markers/1x/0-60-60.png'
import icon_30_60_60_url from '../../img/markers/1x/30-60-60.png'
import icon_60_60_60_url from '../../img/markers/1x/60-60-60.png'
import icon_90_60_38_url from '../../img/markers/1x/90-60-38.png'
import icon_90_60_60_url from '../../img/markers/1x/90-60-60.png'
import icon_120_60_60_url from '../../img/markers/1x/120-60-60.png'
import icon_150_60_60_url from '../../img/markers/1x/150-60-60.png'
import icon_180_60_60_url from '../../img/markers/1x/180-60-60.png'
import icon_210_60_60_url from '../../img/markers/1x/210-60-60.png'
import icon_240_60_60_url from '../../img/markers/1x/240-60-60.png'
import icon_270_60_60_url from '../../img/markers/1x/270-60-60.png'
import icon_300_60_60_url from '../../img/markers/1x/300-60-60.png'
import icon_330_60_60_url from '../../img/markers/1x/330-60-60.png'
import icon_0_0_60_retinaUrl from '../../img/markers/2x/0-0-60@2x.png'
import icon_0_60_60_retinaUrl from '../../img/markers/2x/0-60-60@2x.png'
import icon_30_60_60_retinaUrl from '../../img/markers/2x/30-60-60@2x.png'
import icon_60_60_60_retinaUrl from '../../img/markers/2x/60-60-60@2x.png'
import icon_90_60_38_retinaUrl from '../../img/markers/2x/90-60-38@2x.png'
import icon_90_60_60_retinaUrl from '../../img/markers/2x/90-60-60@2x.png'
import icon_120_60_60_retinaUrl from '../../img/markers/2x/120-60-60@2x.png'
import icon_150_60_60_retinaUrl from '../../img/markers/2x/150-60-60@2x.png'
import icon_180_60_60_retinaUrl from '../../img/markers/2x/180-60-60@2x.png'
import icon_210_60_60_retinaUrl from '../../img/markers/2x/210-60-60@2x.png'
import icon_240_60_60_retinaUrl from '../../img/markers/2x/240-60-60@2x.png'
import icon_270_60_60_retinaUrl from '../../img/markers/2x/270-60-60@2x.png'
import icon_300_60_60_retinaUrl from '../../img/markers/2x/300-60-60@2x.png'
import icon_330_60_60_retinaUrl from '../../img/markers/2x/330-60-60@2x.png'
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

export const yellowIcon = L.icon({
  className: 'icon-active',
  iconUrl: yellowIconUrl,
  iconRetinaUrl: yellowRetinaIconUrl,
  ...iconDefaults
})

export const greyIcon = L.icon({
  iconUrl: icon_0_0_60_url,
  iconRetinaUrl: icon_0_0_60_retinaUrl,
  ...iconDefaults
})

/* eslint camelcase: 0 */
// same as grey icon
export const icon_0_0_60 = L.icon({
  iconUrl: icon_0_0_60_url,
  iconRetinaUrl: icon_0_0_60_retinaUrl,
  ...iconDefaults
})
export const icon_0_60_60 = L.icon({
  iconUrl: icon_0_60_60_url,
  iconRetinaUrl: icon_0_60_60_retinaUrl,
  ...iconDefaults
})
export const icon_30_60_60 = L.icon({
  iconUrl: icon_30_60_60_url,
  iconRetinaUrl: icon_30_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_60_60_60 = L.icon({
  iconUrl: icon_60_60_60_url,
  iconRetinaUrl: icon_60_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_90_60_38 = L.icon({
  iconUrl: icon_90_60_38_url,
  iconRetinaUrl: icon_90_60_38_retinaUrl,
  ...iconDefaults
})

export const icon_90_60_60 = L.icon({
  iconUrl: icon_90_60_60_url,
  iconRetinaUrl: icon_90_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_120_60_60 = L.icon({
  iconUrl: icon_120_60_60_url,
  iconRetinaUrl: icon_120_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_150_60_60 = L.icon({
  iconUrl: icon_150_60_60_url,
  iconRetinaUrl: icon_150_60_60_retinaUrl,
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

export const icon_240_60_60 = L.icon({
  iconUrl: icon_240_60_60_url,
  iconRetinaUrl: icon_240_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_270_60_60 = L.icon({
  iconUrl: icon_270_60_60_url,
  iconRetinaUrl: icon_270_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_300_60_60 = L.icon({
  iconUrl: icon_300_60_60_url,
  iconRetinaUrl: icon_300_60_60_retinaUrl,
  ...iconDefaults
})

export const icon_330_60_60 = L.icon({
  iconUrl: icon_330_60_60_url,
  iconRetinaUrl: icon_330_60_60_retinaUrl,
  ...iconDefaults
})

/* eslint no-use-before-define: 2 */

export const iconsByLayerType = {
  [BREACH_PRIMARY]: icon_210_60_60,
  [BREACH_REGIONAL]: icon_90_60_38,
  [BREACH_FLOODING]: icon_30_60_60,
  [BREACH_WATERSYSTEM]: icon_0_60_60,
  [BREACH_OUTSIDE_DIKE]: icon_270_60_60,
  default: defaultIcon
}
