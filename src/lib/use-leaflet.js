import { onMounted, ref, watch } from "vue";
import mapFactory from "./leaflet-utils/map-factory";
import { isPromise } from '@/lib/utils'
import L from '@/lib/leaflet-utils/leaf'
import createLayer from './leaflet-utils/layer-factory'

export function useLeaflet({ el, config, callbacks, cluster, layers }) {
  let map;
  let layerGroup;

  onMounted(() => {
    map = mapFactory(el.value, {}, config.value, callbacks.onPrint)
    layerGroup = L.layerGroup().addTo(map)
    callbacks.initMapObject(map)

    layerGroup.clearLayers()

    const leafletLayers = layers
      .filter(layer => !layer.hide)

    leafletLayers
      .map(layer => createLayer(layer, callbacks, cluster, {}))
      .filter(layer => layer)
      .forEach(async layer => {
        if (isPromise(layer)) {
          console.log('Promise layer')
          layer = await layer
        }

        console.log('Adding layer', layer)

        layerGroup.addLayer(layer)
      })
  })

  watch([layers, cluster], () => {
    const changedOpacityLayers = layers.filter((layer) => {
      // lookup the old layer in the old values
      const oldLayer = layers.find(l => l.layerObj.id === layer.layerObj.id)

      if (oldLayer) {
        const opacity = layer.layerObj.properties.opacity
        const oldOpacity = oldLayer.layerObj.properties.opacity

        return opacity !== oldOpacity
      } else {
        return false
      }
    })

    // manually change opacity of the layers where opacity changed
    // (this is very specific behaviour, but it improves the UX so much that it's worth it)
    if (changedOpacityLayers.length) {
      changedOpacityLayers.forEach(layer => {
        const mapLayer = layerGroup.getLayers().find(l => l.options.layers === layer.layer)

        // I added this check because sometimes mapLayer returned undefined
        if(mapLayer) {
          mapLayer.setOpacity(layer.layerObj.properties.opacity)
        }
      })

      return
    }

    layerGroup.clearLayers()

    const leafletLayers = layers.filter(layer => !layer.hide)

    leafletLayers
      .map(layer => createLayer(layer, callbacks, cluster, {}))
      .filter(layer => layer)
      .forEach(async layer => {
        if (isPromise(layer)) {
          console.log('Promise layer')
          layer = await layer
        }

        console.log('Adding layer', layer)

        layerGroup.addLayer(layer)
      })
  })

  return {
    el,
  }
}
