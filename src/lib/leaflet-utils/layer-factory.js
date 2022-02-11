import _ from 'lodash'
import L from '@/lib/leaflet-utils/leaf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import mapConfig from '@/map.config'
import { getLayerType } from '@/lib/liwo-identifiers'
import { greyIcon, yellowIcon, defaultIcon, iconsByLayerType } from '@/lib/leaflet-utils/markers'

import './cluster-icon.css'

// store vnode so we can use it to interact with the component using the directive using events
// TODO: rewrite directive as component so we can handle this is clearer way
let vnode

// emit custom events to the component implementing the directive
// when vnode.context.$emit does not workd
function emit (vnode, name, data) {
  var handlers = (vnode.data && vnode.data.on) ||
    (vnode.componentOptions && vnode.componentOptions.listeners)

  if (handlers && handlers[name]) {
    handlers[name].fns(data)
  }
}

export default function createLayer (layer, { onClick }, _, vnodeRef) {
  vnode = vnodeRef
  if (layer.type === 'json' && layer.geojson) {
    return createGeoJson(layer)
  } else if (layer.type === 'cluster') {
    return createCluster(layer, onClick)
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

function createCluster (layer, onClick) {
  // We have a nested structure of layers
  // LayerGroup -> [ MarkerCluster, Geojson ]
  // When selected the markers are filtered from the cluster and show up in the geojson layer
  // This makes it rather slow
  const layerGroup = L.layerGroup()

  // create the cluster  layer
  const clusterGroup = L.markerClusterGroup({
    iconCreateFunction: clusterIconCreateFunction(layer),
    maxClusterRadius: 60
  })
  // create the markers
  const geojsonLayer = createClusterGeoJson(layer, (evt) => {
    evt.geojsonLayer = geojsonLayer
    onClick(evt)
    clusterGroup.refreshClusters()
  })
  // add the geojson layer to the cluster (lowest level)
  clusterGroup.addLayer(geojsonLayer)
  // add  the cluster to the group
  layerGroup.addLayer(clusterGroup)
  // now create the selected markers
  const selectedLayer = createSelectedGeojson(layer, (evt) => {
    evt.geojsonLayer = selectedLayer
    onClick(evt)
    clusterGroup.refreshClusters()
  })
  // also add  them
  layerGroup.addLayer(selectedLayer)
  // TODO: check if we can set opacity here...
  layerGroup.layerId = layer.layerId

  return layerGroup
}

// set custom  style for selected features
function onEachFeature (feature, marker, onClick) {
  const { name } = feature.properties
  // TODO: implement is  controllable
  marker.on('click', (evt) => {
    onClick(evt)
  })
  marker.on('mouseover', (event) => {
    marker.bindTooltip(name)

    // emit properties so e.g. state can be used to set tooltip text
    emit(vnode, 'marker:mouseover', { feature, marker })

    event.target.openTooltip()
  })
  marker.on('mouseout', (event) => {
    event.target.closeTooltip()
    marker.unbindTooltip()
  })
  // color selected feature as red
  if (marker.feature.properties.missing) {
    marker.setIcon(greyIcon)
  } else if (marker.feature.properties.selected) {
    marker.setIcon(yellowIcon)
  } else {
    const layerType = getLayerType(feature)
    const icon = _.get(iconsByLayerType, layerType, defaultIcon)
    marker.setIcon(icon)
  }
}

function pointToLayer (feature, latlng, options) {
  // TODO: consider using circleMarker to allow faster and css based styling
  const layer = L.marker(latlng, options)
  return layer
}

export function createClusterGeoJson (layer, onClick) {
  // create the geojson layer used as 0 level for the clusters
  const opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  const markerOptions = {
    opacity
  }
  const options = {
    // set custom  style for selected features
    onEachFeature: (feature, marker) => onEachFeature(feature, marker, onClick),
    pointToLayer: (feature, latlng) => pointToLayer(feature, latlng, markerOptions)
  }
  if (_.has(layer, 'filter')) {
    options.filter = layer.filter
  }
  const unselectedGeoJson = {
    ...layer.geojson
  }
  unselectedGeoJson.features = unselectedGeoJson.features.filter(feature => !feature.properties.selected)
  return L.geoJson(unselectedGeoJson, options)
}

export function createSelectedGeojson (layer, onClick) {
  // create the markers for the selected geojsons
  const options = {
    onEachFeature: (feature, marker) => onEachFeature(feature, marker, onClick),
    pointToLayer: (feature, latlng) => pointToLayer(feature, latlng, {})
  }
  if (_.has(layer, 'filter')) {
    options.filter = layer.filter
  }
  const selectedGeoJson = {
    ...layer.geojson
  }
  selectedGeoJson.features = selectedGeoJson.features.filter(feature => feature.properties.selected)
  return L.geoJson(selectedGeoJson, options)
}

export function createTile (layer) {
  const opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  return L.tileLayer(layer.url, { opacity })
}

export async function createWms (layer) {
  // these options come frome the vaiant properties of the layer
  const { namespace, attribution, style } = layer
  // fully visible by default
  const opacity = _.get(layer.layerObj, 'properties.opacity', 1)
  const url = await getGeoServerURL(namespace)
  return L.tileLayer.wms(url, {
    // TODO: layer is now sometimes a string, sometimes an object. Clean this up
    layers: layer.layer,
    format: 'image/png',
    transparent: true,
    attribution,
    tiled: true,
    styles: style,
    opacity
  })
}

async function getGeoServerURL (namespace) {
  const services = await mapConfig.getServices()
  const DYNAMIC_GEOSERVER_URL = services.DYNAMIC_GEOSERVER_URL
  const STATIC_GEOSERVER_URL = services.STATIC_GEOSERVER_URL
  return namespace === 'LIWO_Operationeel'
    ? DYNAMIC_GEOSERVER_URL
    : STATIC_GEOSERVER_URL
}

function clusterIconCreateFunction (layer) {
  return function (cluster) {
    const childCount = cluster.getChildCount()
    const opacity = _.get(layer.layerObj, 'properties.opacity', 1)
    const type = layer.layer
    const icon = L.divIcon({
      html: `<div class="cluster-icon cluster-icon__${type}" style="opacity: ${opacity};"><span>${childCount}</span></div>`,
      className: '',
      iconSize: new L.Point(45, 45)
    })
    return icon
  }
}
