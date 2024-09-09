import _ from 'lodash'
import L from '@/lib/leaflet-utils/leaf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import mapConfig from '@/map.config'
import { getLayerType } from '@/lib/liwo-identifiers'
import { greyIcon, yellowIcon, defaultIcon, iconsByLayerType } from '@/lib/leaflet-utils/markers'

import './cluster-icon.css'

export default function createLayer (layer, callbacks, abortSignal) {
  if (layer.type === 'json' && layer.geojson) {
    return createGeoJson(layer)
  } else if (layer.type === 'cluster') {
    return createCluster(layer, callbacks)
  } else if (layer.type === 'tile') {
    return createTile(layer)
  } else if (!layer.hideWms) {
    return createWms(layer, callbacks, abortSignal)
  } else {
    return Promise.resolve(null)
  }
}

async function createGeoJson (layer) {
  return L.geoJson(layer.geojson, {
    style: () => {
      // TODO:  Is this used?
      return { className: layer.style }
    }
  })
}

async function createCluster (layer, callbacks) {

  // We have a nested structure of layers
  // LayerGroup -> [ MarkerCluster, Geojson ]
  // When selected the markers are filtered from the cluster and show up in the geojson layer
  // This makes it rather slow
  const layerGroup = L.layerGroup([], getLayerOptions(layer))

  // create the cluster  layer
  const clusterGroup = L.markerClusterGroup({
    iconCreateFunction: clusterIconCreateFunction(layer),
    maxClusterRadius: 60
  })
  // create the markers
  const geojsonLayer = createClusterGeoJson(layer, {
    ...callbacks,
    onClick: (evt) => {
      evt.geojsonLayer = geojsonLayer
      callbacks.onClick(evt)
      clusterGroup.refreshClusters()
    }
  })
  // add the geojson layer to the cluster (lowest level)
  clusterGroup.addLayer(geojsonLayer)
  // add  the cluster to the group
  layerGroup.addLayer(clusterGroup)
  // now create the selected markers
  const selectedLayer = createSelectedGeojson(layer, {
    ...callbacks,
    onClick: (evt) => {
      evt.geojsonLayer = selectedLayer
      callbacks.onClick(evt)
      clusterGroup.refreshClusters()
    }
  })
  // also add  them
  layerGroup.addLayer(selectedLayer)
  // TODO: check if we can set opacity here...
  layerGroup.layerId = layer.layerId

  return layerGroup
}


export async function createTile (layer) {
  return L.tileLayer(layer.url, getLayerOptions(layer))
}

export async function createWms (layer, _callbacks, abortSignal) {
  const { url, options } = await getWmsSettings(layer)
  abortSignal.throwIfAborted()

  return L.tileLayer.wms(url, {
    ...options,
  })
}

async function getWmsSettings (layer) {
  const services = await mapConfig.getServices()
  const customMapConfig = mapConfig.getCustomMapConfig(services)
  const defaultOptions = {
    ...getLayerOptions(layer),
    format: 'image/png',
    transparent: true,
  }

  if (customMapConfig[layer.layer] && customMapConfig[layer.layer].url) {
    return {
        url: customMapConfig[layer.layer].url,
        options: {
          ...defaultOptions,
          ...customMapConfig[layer.layer].config
      }
    }
  }

  return {
    url: layer.namespace === 'LIWO_Operationeel'
      ? services.DYNAMIC_GEOSERVER_URL
      : services.STATIC_GEOSERVER_URL,
    options: {
      ...defaultOptions,
      attribution: layer.attribution,
      tiled: true,
      styles: layer.style
    }
  }
}

function pointToLayer (_feature, latlng, options) {
  // TODO: consider using circleMarker to allow faster and css based styling
  const layer = L.marker(latlng, options)
  return layer
}

function clusterIconCreateFunction (layer) {
  return function (cluster) {
    const childCount = cluster.getChildCount()
    const opacity = layer.layerObj?.properties?.opacity || 1
    const type = layer.layer
    const icon = L.divIcon({
      html: `<div class="cluster-icon cluster-icon__${type}" style="opacity: ${opacity};"><span>${childCount}</span></div>`,
      className: '',
      iconSize: new L.Point(45, 45)
    })
    return icon
  }
}

function createSelectedGeojson (layer, callbacks) {
  // create the markers for the selected geojsons
  const options = {
    onEachFeature: (feature, marker) => onEachFeature(feature, marker, callbacks),
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

function createClusterGeoJson (layer, callbacks) {
  // create the geojson layer used as 0 level for the clusters
  const opacity = layer.layerObj?.properties?.opacity || 1
  const markerOptions = {
    opacity
  }
  const options = {
    // set custom  style for selected features
    onEachFeature: (feature, marker) => onEachFeature(feature, marker, callbacks),
    pointToLayer: (feature, latlng) => pointToLayer(feature, latlng, markerOptions)
  }
  if (_.has(layer, 'filter')) {
    options.filter = layer.filter
  }
  const unselectedGeoJson = {
    ...layer.geojson
  }
  if (unselectedGeoJson.features) {
    unselectedGeoJson.features = unselectedGeoJson.features.filter(feature => !feature.properties.selected)
  }

  return L.geoJson(unselectedGeoJson, options)
}

// set custom  style for selected features
function onEachFeature (feature, marker, { onClick, onMarkerHover }) {
  const { name } = feature.properties
  // TODO: implement is  controllable
  marker.on('click', (evt) => {
    onClick(evt)
  })
  marker.on('mouseover', (event) => {
    marker.bindTooltip(name)

    // emit properties so e.g. state can be used to set tooltip text
    onMarkerHover({ feature, marker })

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

function getLayerOptions(layer) {
  return {
    // fully visible by default
    opacity: layer.layerObj?.properties?.opacity || 1,
    layers: layer.layer,
    breachBandId: layer.layerObj?.breachBandId,
  }
}
