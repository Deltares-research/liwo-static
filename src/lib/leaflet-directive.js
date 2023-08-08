import { deepEqual } from 'fast-equals'
import { isPromise } from '@/lib/utils'
import L from '@/lib/leaflet-utils/leaf'
import createLayer from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'

let map
let layerGroup

const install = (app) => {
  app.directive('leaflet', {

    mounted (el, { value }, vnode) {
      const { config, callbacks } = value
      map = mapFactory(el, vnode, config, callbacks.onPrint)
      layerGroup = L.layerGroup().addTo(map)
      callbacks.initMapObject(map)
    },

    updated (_, { value, oldValue }, vnode) {
      // check if of one of the layers the opacity changed
      const changedOpacityLayers = value.layers.filter((layer) => {
        // lookup the old layer in the old values
        const oldLayer = oldValue.layers.find(l => l.layerObj.id === layer.layerObj.id)

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

      if (deepEqual(value, oldValue)) {
        return
      }
      const { callbacks, cluster } = value

      // TODO: why? remove falsy values?
      const layers = value.layers.filter(value => value)

      layerGroup.clearLayers()

      const leafletLayers = layers
        .filter(layer => !layer.hide)

      leafletLayers
        .map(layer => createLayer(layer, callbacks, cluster, vnode))
        .filter(layer => layer)
        .forEach(async layer => {
          if (isPromise(layer)) {
            layer = await layer
          }

          layerGroup.addLayer(layer)
        })
    }
  })
}

export default install
