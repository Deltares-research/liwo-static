import L from 'leaflet'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import mapConfig from '../../map.config.js'
import { redIcon } from './markers'

import './cluster-icon.css'

const BREACHES_LAYER_ID = 'geo_doorbraaklocaties_primair'
const DEFAULT_ICON = new L.Icon.Default()
const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL
const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL

export default function renderLayer (layer, { breachCallBack }) {
  if (layer.type === 'json' && layer.geojson) {
    if (layer.layer === BREACHES_LAYER_ID) {
      const markers = L.markerClusterGroup({
        iconCreateFunction: clusterIconFunction(layer.breachType || 'primary')
      })
      markers.addLayer(renderBreachGeoJson(layer, breachCallBack))
      return markers
    } else {
      return renderGeoJson(layer)
    }
  } else {
    return renderWms(layer)
  }
}

export function renderGeoJson ({ geojson, style }) {
  return L.geoJson(geojson, {
    style: () => {
      return { className: style }
    }
  })
}

export function renderBreachGeoJson ({ geojson }, callback) {
  return L.geoJson(geojson, {
    onEachFeature: (_, layer) => {
      const { naam, dijkringnr } = layer.feature.properties
      layer.bindTooltip(`(${dijkringnr}) ${naam}`)
      layer.on('click', (event) => breachClickHandler(event, callback))
      layer.on('mouseover', (event) => { event.target.openTooltip() })
      layer.on('mouseout', (event) => { event.target.closeTooltip() })

      layer.feature.properties.selected
        ? layer.setIcon(redIcon)
        : layer.setIcon(DEFAULT_ICON)
    }
  })
}

export function renderWms ({ namespace, layer, attribution, style }) {
  return L.tileLayer.wms(geoServerURL(namespace), {
    layers: layer,
    format: 'image/png',
    transparent: true,
    attribution,
    styles: style
  })
}

function geoServerURL (namespace) {
  return namespace === 'LIWO_Operationeel'
    ? DYNAMIC_GEOSERVER_URL
    : STATIC_GEOSERVER_URL
}

function breachClickHandler (event, callback) {
  const selected = event.target.feature.properties.selected

  selected
    ? event.target.setIcon(DEFAULT_ICON)
    : event.target.setIcon(redIcon)

  event.target.feature.properties.selected = !selected

  if (callback) {
    callback(event)
  }
}

function clusterIconFunction (type) {
  return function (cluster) {
    let childCount = cluster.getChildCount()

    return new L.DivIcon({
      html: '<div><span>' + childCount + '</span></div>',
      className: `cluster-icon cluster-icon__${type}`,
      iconSize: new L.Point(40, 40)
    })
  }
}
