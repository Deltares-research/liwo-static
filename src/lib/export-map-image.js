import delay from 'delay'

import downloadBlob from './download-blob'
import L from './leaflet-utils/leaf'
import mapConfig from '../map.config'
import rdConfig from './rijksdriehoek.config.js'

import matrices from  './matrices.json'

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
    // TODO: why does this work (localhost??)
    icons: [
      `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layer.id}&STYLE=${style}`
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
    // TODO: why does this work (localhost??)
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
