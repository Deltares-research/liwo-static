import delay from 'delay'

import downloadBlob from './download-blob'
import L from './leaflet-utils/leaf'
import mapConfig from '../map.config'
import rdConfig from './rijksdriehoek.config.js'

const printGeoServerURI = mapConfig.services.PRINT_GEO_SERVER
const DEFAULT_DPI = 300

export default function requestImage (options) {
  const body = JSON.stringify(requestBody(options))

  return fetch(`${printGeoServerURI}/print/liwo/report.${options.outputFormat}`, {
    method: 'POST',
    mode: 'cors',
    body
  })
    .then(response => response.json())
    .then(downloadRefs => statusPolling(`${printGeoServerURI}/${downloadRefs.statusURL}`))
    .then(statusPromise => statusPromise)
    .then(statusResponse => statusResponse.json())
    .then(downloadRefs => fetch(`${printGeoServerURI}${downloadRefs.downloadURL.substring(1)}`))
    .then(res => res.blob())
    .then((blob) => {
      downloadBlob({
        blob,
        filename: `${options.outputFilename}.${options.outputFormat}`,
        type: `image/${options.outputFormat}`
      })
    })
    .catch(error => console.log('ERROR', error))
}

export function requestBody (options) {
  return {
    layout: 'A4 portrait',
    outputFormat: options.outputFormat,
    outputFilename: options.outputFilename,
    attributes: {
      title: 'LIWO',
      description: options.description,
      legend: {
        name: 'Legenda',
        classes: formatLegend(options)
      },
      map: {
        center: options.center,
        dpi: DEFAULT_DPI,
        layers: formatMapLayers(options),
        projection: rdConfig.crsType,
        rotation: 0,
        scale: getScale(options.map)
      }
    }
  }
}

function formatLegend ({ layers }) {
  return layers.map(legendItem)
}

function legendItem ({ layer, style, layerTitle }) {
  return {
    name: layerTitle || 'Onbekende legenda',
    icons: [
      `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layer}&STYLE=${style}`
    ]
  }
}

function formatMapLayers ({ layers, background }) {
  const baseLayer = background
    ? [{
      baseURL: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts',
      layer: 'brtachtergrondkaart',
      dimensionParams: {},
      dimensions: null,
      imageFormat: 'image/png',
      matrixSet: 'EPSG:28992',
      opacity: 1,
      requestEncoding: 'KVP',
      type: 'WMTS',
      version: '1.0.0',
      matrices
    }]
    : []

  const resultLayers = layers
    .filter(layer => layer.type !== 'json')
    .map(mapLayerItem)

  return [ ...resultLayers, ...baseLayer ]
}

function mapLayerItem ({ layer, style, type, namespace }) {
  return {
    baseURL: `http://localhost:8080/geoserver/wms`,
    imageFormat: 'image/png',
    layers: [ `${namespace}:${layer}` ],
    opacity: 1,
    customParams: {
      transparent: true
    },
    serverType: 'geoserver',
    styles: [ style ],
    type
  }
}

async function statusPolling (url) {
  let statusPromise = fetch(url)
  let isDone = false

  while (!isDone) {
    await delay(800)
    const response = await statusPromise
    const { done } = await response.json()

    statusPromise = fetch(url)
    isDone = done
  }

  return statusPromise
}

function getScale (map) {
  var DOTS_PER_INCH = 72
  var INCHES_PER_METER = 1.0 / 0.02540005080010160020
  var INCHES_PER_KM = INCHES_PER_METER * 1000.0
  var sw = map.getBounds().getSouthWest()
  var ne = map.getBounds().getNorthEast()
  var halflat = (sw.lat + ne.lat) / 2.0
  var midLeft = new L.LatLng(halflat, sw.lng)
  var midRight = new L.LatLng(halflat, ne.lng)
  var mwidth = midLeft.distanceTo(midRight)
  var pxwidth = map.getSize().x
  var kmperpx = mwidth / pxwidth / 1000.0
  var scale = (kmperpx || 0.000001) * INCHES_PER_KM * DOTS_PER_INCH
  scale *= 2.0 // no idea why but it&#039;s doubled
  scale = 10000 * Math.round(scale / 10000.0) // round to the nearest 1,000 so we can fit MapFish print&#039;s finite set of scales

  return scale
}

const matrices = [
  {
    identifier: 'EPSG:28992:0',
    matrixSize: [
      1,
      1
    ],
    scaleDenominator: 12288000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:1',
    matrixSize: [
      2,
      2
    ],
    scaleDenominator: 6144000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:2',
    matrixSize: [
      4,
      4
    ],
    scaleDenominator: 3072000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:3',
    matrixSize: [
      8,
      8
    ],
    scaleDenominator: 1536000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:4',
    matrixSize: [
      16,
      16
    ],
    scaleDenominator: 768000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:5',
    matrixSize: [
      32,
      32
    ],
    scaleDenominator: 384000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:6',
    matrixSize: [
      64,
      64
    ],
    scaleDenominator: 192000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:7',
    matrixSize: [
      128,
      128
    ],
    scaleDenominator: 96000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:8',
    matrixSize: [
      256,
      256
    ],
    scaleDenominator: 48000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:9',
    matrixSize: [
      512,
      512
    ],
    scaleDenominator: 24000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:10',
    matrixSize: [
      1024,
      1024
    ],
    scaleDenominator: 12000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:11',
    matrixSize: [
      2048,
      2048
    ],
    scaleDenominator: 6000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:12',
    matrixSize: [
      4096,
      4096
    ],
    scaleDenominator: 3000,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:13',
    matrixSize: [
      8192,
      8192
    ],
    scaleDenominator: 1500,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  },
  {
    identifier: 'EPSG:28992:14',
    matrixSize: [
      16384,
      16384
    ],
    scaleDenominator: 750,
    tileSize: [
      256,
      256
    ],
    topLeftCorner: [
      -285401.92,
      903401.92
    ]
  }
]
