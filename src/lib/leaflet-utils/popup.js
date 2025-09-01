import L from '@/lib/leaflet-utils/leaf'
import getFeatureInfo from '@/lib/get-feature-info'
import { getLayerInfoValue } from './get-layer-info-value'

import getCombinedFeatureInfo from '../get-combined-feature-info.js'

export async function showLayersInfoPopup ({ map, selectedLayers, position, latlng, showTitle = true }) {
  const bounds = map.getBounds()

  const promises = selectedLayers.map(selectedLayer => {
    return getFeatureInfo({
      bounds,
      x: position.x,
      y: position.y,
      width: map._size.x,
      height: map._size.y,
      layer: selectedLayer.layer
    }).then(data => {
      const value = getLayerInfoValue(data, selectedLayer.layer, selectedLayer.layerObj)

      if (value === null || value === -9999) {
        return
      }

      const formattedValue = formatLayerValue(value)
      const formattedUnit = formatUnit(selectedLayer.mapTitle || selectedLayer.layerObj?.properties?.legend?.title)

      return {
        unit: formattedUnit,
        title: selectedLayer.layerObj.properties.name,
        layerTitle: selectedLayer.layerSet.name,
        value: formattedValue
      }
    })
  })

  const data = await Promise.all(promises)
  const filteredData = data.filter(d => d)

  if (filteredData.length === 1) {
    filteredData.forEach(item => {
      L.popup()
        .setLatLng(latlng)
        .setContent(formatValue(item, false))
        .openOn(map)
    })
  }

  if (filteredData.length > 1) {
    const content = filteredData.map(item => formatValue(item, showTitle)).join('<br>')

    L.popup()
      .setLatLng(latlng)
      .setContent(content)
      .openOn(map)
  }

  return
}

export async function showCombinedLayersInfoPopup ({ map, selectedLayers, latlng }) {
  const promises = selectedLayers.map(selectedLayer => {
    return getCombinedFeatureInfo({ lat: latlng.lat, lng: latlng.lng, selectedLayer })
      .then((value) => {
        if (!value?.[0]) {
          return
        }

        const formattedValue = formatLayerValue(value[0])
        const formattedUnit = formatUnit(selectedLayer.mapTitle || selectedLayer.layerObj?.properties?.legend?.title)

        return {
          unit: formattedUnit,
          value: formattedValue,
        }
    })
  })

  const data = await Promise.all(promises)
  const filteredData = data.filter(d => d)

  filteredData.forEach(item => {
    L.popup()
      .setLatLng(latlng)
      .setContent(formatValue(item))
      .openOn(map)
  })

  return
}

function formatLayerValue (value) {
  return value.toFixed(2).toString()
}

function formatUnit (title) {
    if (title) {
        return title.split('[').pop().split(']')[0]
    }

    return '-'
}

function formatValue ({ value, layerTitle, title, unit }, showTitle = true) {
  return showTitle && title && layerTitle
    ? `${title} <em>(${layerTitle})</em>: <b>${value} [${unit}]</b>`
    : `<b>${value} [${unit}]</b>`
}
