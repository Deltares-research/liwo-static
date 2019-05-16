import L from '@/lib/leaflet-utils/leaf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import mapConfig from '@/map.config'

import './cluster-icon.css'

const DEFAULT_ICON = new L.Icon.Default()

const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL
const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL

export default function createLayer (layer, { breachCallBack }) {
  if (layer.type === 'json' && layer.geojson) {
    return createGeoJson(layer)
  } else if (layer.type === 'cluster') {
    const layerGroup = L.layerGroup()
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: clusterIconFunction(layer.layer || 'BREACH_PRIMARY'),
      maxClusterRadius: 40
    })
    // TODO, get this out of here....
    let geojsonLayer = createBreachGeoJson(layer, breachCallBack)
    clusterGroup.addLayer(geojsonLayer)

    layerGroup.addLayer(clusterGroup)

    layerGroup.layerId = layer.layerId

    return layerGroup
  } else if (layer.type === 'tile') {
    return createTile(layer)
  } else if (!layer.hideWms) {
    return createWms(layer)
  } else {
    return null
  }
}

export function createGeoJson ({ geojson, style }) {
  return L.geoJson(geojson, {
    style: () => {
      return { className: style }
    }
  })
}

// TODO: remove this here...
export function createBreachGeoJson ({ geojson, layer: layerId, opacity }, callback) {
  let options = {
    onEachFeature: (_, layer) => {
      const { naam, selectedVariant, isControllable } = layer.feature.properties

      layer.bindTooltip(`${naam}${selectedVariant ? ` - ${selectedVariant}` : ''}`)
      isControllable && layer.on('click', (event) => breachClickHandler(event, callback))
      layer.on('mouseover', (event) => { event.target.openTooltip() })
      layer.on('mouseout', (event) => { event.target.closeTooltip() })

      layer.feature.properties.layerType = layerId
      // TODO: solve in CSS
      // layer.feature.properties.selected
      //   ? layer.setIcon(DEFAULT_ICON)
      //   : layer.setIcon(layer.getIcon(layerId))
    }
  }
  return L.geoJson(geojson, options)
}

export function createTile ({ url, opacity }) {
  return L.tileLayer(url, { opacity })
}

export function createWms ({ namespace, layer, attribution, style, opacity }) {
  return L.tileLayer.wms(geoServerURL(namespace), {
    layers: layer,
    format: 'image/png',
    transparent: true,
    attribution,
    styles: style,
    opacity
  })
}

function geoServerURL (namespace) {
  return namespace === 'LIWO_Operationeel'
    ? DYNAMIC_GEOSERVER_URL
    : STATIC_GEOSERVER_URL
}

// TODO: move to component/view
function breachClickHandler (event, callback) {
  const { selected } = event.target.feature.properties

  event.target.setIcon(event.target.getIcon(event.target))

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
      iconSize: new L.Point(45, 45)
    })
  }
}
