import _ from 'lodash'
import L from '@/lib/leaflet-utils/leaf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import mapConfig from '@/map.config'
import { getLayerType } from '@/lib/liwo-identifiers'
import { redIcon, defaultIcon, iconsByLayerType } from '@/lib/leaflet-utils/markers'

import './cluster-icon.css'

const DYNAMIC_GEOSERVER_URL = mapConfig.services.DYNAMIC_GEOSERVER_URL
const STATIC_GEOSERVER_URL = mapConfig.services.STATIC_GEOSERVER_URL

export default function createLayer (layer, { onClick }) {
  if (layer.type === 'json' && layer.geojson) {
    return createGeoJson(layer)
  } else if (layer.type === 'cluster') {
    const layerGroup = L.layerGroup()
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: clusterIconFunction(layer.layer || 'BREACH_PRIMARY'),
      maxClusterRadius: 40
    })
    // TODO, get this out of here....
    let geojsonLayer = createClusterGeoJson(layer, (evt) => {
      evt.geojsonLayer = geojsonLayer
      onClick(evt)
      clusterGroup.refreshClusters()
    })
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
      // TODO:  Is this used?
      return { className: style }
    }
  })
}

// TODO: remove this here...
export function createClusterGeoJson (layer, onClick) {
  let options = {
    // set custom  style for selected features
    onEachFeature: (feature, marker) => {
      const { naam, selectedVariant } = feature.properties

      // TODO: move this out of here...
      marker.bindTooltip(`${naam}${selectedVariant ? ` - ${selectedVariant}` : ''}`)
      // TODO: implement is  controllable
      marker.on('click', (evt) => {
        evt.layer = layer
        onClick(evt)
      })
      marker.on('mouseover', (event) => {
        event.target.openTooltip()
      })
      marker.on('mouseout', (event) => {
        event.target.closeTooltip()
      })
      // color selected feature as red
      if (marker.feature.properties.selected) {
        marker.setIcon(redIcon)
      } else {
        let layerType = getLayerType(feature)
        let icon = _.get(iconsByLayerType, layerType, defaultIcon)
        marker.setIcon(icon)
      }
    }
  }
  if (_.has(layer, 'filter')) {
    options.filter = layer.filter
  }
  let opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  options.opacity = opacity
  return L.geoJson(layer.geojson, options)
}

export function createTile (layer) {
  let opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  return L.tileLayer(layer.url, { opacity })
}

export function createWms (layer) {
  // these options come frome the vaiant properties of the layer
  let { namespace, attribution, style } = layer
  // fully visible by default
  let opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  return L.tileLayer.wms(geoServerURL(namespace), {
    // TODO: layer is now sometimes a string, sometimes an object. Clean this up
    layers: layer.layer,
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
