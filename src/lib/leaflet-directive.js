import layerFactory from './leaflet-utils/layer-factory'
import mapFactory from './leaflet-utils/map-factory'
import L from '@/lib/leaflet-utils/leaf'

let map
let currentMapLayers = []
let leafletLayers = []
let layerGroup

export default {
  bind (el, { value }) {
    let { config, callbacks } = value
    map = mapFactory(el, config)
    layerGroup = L.layerGroup().addTo(map)
    callbacks.initMapObject(map)
  },
  update (_, { value, oldValue }) {
    if (value === oldValue) {
      return
    }

    const { mapLayers, callbacks } = value

    const mapLayersToDelete = currentMapLayers.reduce((layersToDelete, layer) => {
      const matchedLayer = mapLayers.find(l => (l.layerId === layer.layerId))

      if (!matchedLayer) {
        layersToDelete.push(layer)
      } else if (matchedLayer.geojson && matchedLayer.geojson.totalFeatures !== layer.geojson.totalFeatures) {
        layersToDelete.push(layer)
      }

      return layersToDelete
    }, [])

    const mapLayersToAdd = mapLayers.reduce((layersToAdd, layer) => {
      const matchedLayer = currentMapLayers.find(l => (l.layerId === layer.layerId))

      if (!matchedLayer) {
        layersToAdd.push(layer)
      } else if (matchedLayer.geojson && matchedLayer.geojson.totalFeatures !== layer.geojson.totalFeatures) {
        layersToAdd.push(layer)
      }

      return layersToAdd
    }, [])

    mapLayersToAdd
      .map(layer => layerFactory(layer, callbacks))
      .forEach(layer => layerGroup.addLayer(layer))

    mapLayersToDelete
      .map(layer => leafletLayers.find(
        leafletLayer => (leafletLayer.layerId || leafletLayer.options.layers) === layer.layer
      ))
      .forEach(leafletLayer => layerGroup.removeLayer(leafletLayer))

    leafletLayers = layerGroup.getLayers()
    currentMapLayers = mapLayers
  }
}
