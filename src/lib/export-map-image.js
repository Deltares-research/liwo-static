import mapConfig from '../map.config'
import rdConfig from './rijksdriehoek.config.js'

const printGeoServerURI = mapConfig.services.PRINT_GEO_SERVER
const DEFAULT_DPI = 300

export default function requestImage (options) {
  const body = requestBody(options)
  const formData = new FormData()

  for (let key in body) {
    formData.append(key, body[key])
  }

  return fetch(`${printGeoServerURI}/print/print/liwo/report.${options.outputFormat}`, {
    method: 'POST',
    mode: 'cors',
    body: formData
  })
    .then(response => response.json())
    .then(downloadRefs => statusPolling(`${printGeoServerURI}/${downloadRefs.statusURL}`))
    .then(statusPromise => statusPromise)
    .then(statusResponse => statusResponse.json())
    .then(downloadRefs => fetch(`${printGeoServerURI}${downloadRefs.downloadURL.substring(1)}`))
    .then(res => res.blob())
    .then((blob) => {
      let anchor = document.createElement('a')
      let windowUrl = window.URL || window.webkitURL
      let blobject = new Blob([blob], { type: `image/${options.outputFormat}` })
      let url = windowUrl.createObjectURL(blobject)
      anchor.setAttribute('href', url)
      anchor.setAttribute('download', `${name}.${options.outputFormat}`)
      anchor.click()
      windowUrl.revokeObjectURL(url)
    })
    .catch(error => console.log('ERROR', error))
}

export function requestBody (options) {
  return {
    layout: 'A4 portrait',
    outputFormat: options.outputFormat,
    outputFilename: options.outputFilename,
    attributes: {
      title: options.title,
      description: options.description,
      legend: {
        name: 'Legenda',
        classes: formatLegend(options)
      }
    },
    map: {
      longitudeFirst: false,
      center: mapConfig.center,
      dpi: DEFAULT_DPI,
      layers: formatMapLayers(options),
      projection: rdConfig.crsType,
      rotation: 0,
      scale: 2430000
    }
  }
}

function formatLegend ({ layers }) {
  return [
    {
      name: 'Samengestelde kaarten - Maximale overstromingsdiepte Nederland - Nederland',
      icons: [
        'http://localhost:8080/geoserver/wms?version=1.3.0&TRANSPARENT=TRUE&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=LIWO_MEGO:geo_maximale_waterdiepte_nederland&STYLE=LIWO_Basis_Waterdiepte'
      ]
    }
  ]
}

function formatMapLayers ({ layers }) {
  return [
    {
      baseURL: 'http://localhost:8080/geoserver/wms',
      customParams: {
        transparent: true
      },
      imageFormat: 'image/png',
      layers: [
        'LIWO_MEGO:geo_maximale_waterdiepte_nederland'
      ],
      opacity: 1,
      serverType: 'geoserver',
      styles: [
        'LIWO_Basis_Waterdiepte'
      ],
      type: 'WMS'
    }
  ]
}

async function statusPolling (url) {
  let statusPromise = fetch(url)
  let isDone = false

  while (!isDone) {
    const response = await statusPromise
    const { done } = await response.json()

    statusPromise = fetch(url)
    isDone = done
  }

  return statusPromise
}
