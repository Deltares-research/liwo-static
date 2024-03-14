<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  import { deepEqual } from 'fast-equals'
  import L from '@/lib/leaflet-utils/leaf'
  import createLayer from '@/lib/leaflet-utils/layer-factory'
  import createMap from '@/lib/leaflet-utils/map-factory'

  export default {
    props: {
      layers: {
        type: Array,
      },
      cluster: {
        type: Boolean,
      },
      config: {
        type: Object,
      },
    },
    created() {
      this.abortController = null
    },
    mounted() {
      this.map = createMap(this.$el, this.config, {
        onPrint: this.onPrint,
        onClick: this.onClick,
        onMarkerHover: this.onMarkerHover,
      })

      this.layerGroup = L.layerGroup().addTo(this.map)
      this.update(this.layers, [])

      this.$emit('initMapObject', this.map)
    },
    methods: {
      onClick(event) {
        this.$emit('map:click', event)
      },

      onPrint(event) {
        this.$emit('print', event)
      },

      onMarkerHover(marker) {
        this.$emit('marker:mouseover', marker)
      },

      getChangedOpacities(newLayers, oldLayers) {
        return newLayers.filter((layer) => {
          // lookup the old layer in the old values
          const oldLayer = oldLayers.find(l => l.layerObj.id === layer.layerObj.id)

          if (oldLayer) {
            const opacity = layer.layerObj.properties.opacity
            const oldOpacity = oldLayer.layerObj.properties.opacity

            return opacity !== oldOpacity
          } else {
            return false
          }
        })
      },

      updateOpacities(layers) {
        layers.forEach(layer => {
          const mapLayer = this.layerGroup.getLayers().find(l => l.options.layers === layer.layer)
          const layerOpacity = layer.layerObj.properties.opacity

          // I added this check because sometimes mapLayer returned undefined
          if (!mapLayer || mapLayer.options.opacity === layerOpacity) {
            return
          }

          if (layer.type !== 'cluster') {
            mapLayer.setOpacity(layerOpacity)
          }

          if (layer.type === 'cluster' && layerOpacity >= 0) {
            this.layerGroup.removeLayer(mapLayer)
            mapLayer.options.opacity = layerOpacity

            if(this.abortController) {
              this.abortController.abort()
            }
            this.abortController = new AbortController()
            createLayer(layer, {
              onMarkerHover: this.onMarkerHover,
              onClick: this.onClick,
            }, this.abortController.signal).then((newLayer) => {
              this.layerGroup.addLayer(newLayer)
            })
          }
        })
      },

      async recreateLayersIfChanged(newLayers, oldLayers) {
        if (deepEqual(newLayers, oldLayers)) {
          return
        }

        /**
         * Abort previous loading layers
         * The issue was that some layers are async.
         * If you quickly switched to another layer while the previous was still loading it would sometimes cause the old layer to be shown on top of the new one.
         * By using the AbortController we signal all old layers to stop loading.
         */
        if(this.abortController) {
          this.abortController.abort()
        }

        this.abortController = new AbortController()

        this.layerGroup.clearLayers()

        const layerPromises = newLayers
          .filter(layer => !layer.hide)
          .map(layer => {
            return createLayer(layer, {
              onMarkerHover: this.onMarkerHover,
              onClick: this.onClick,
            }, this.abortController.signal)
          })
          .filter(layer => layer)

        const layerResults = await Promise.allSettled(layerPromises)

        layerResults.forEach(layer => {
          if(layer.status === 'fulfilled') {
            this.layerGroup.addLayer(layer.value)
          } else if(layer.reason.name !== 'AbortError') {
            console.log(`Error while loading layer`, layer.reason)
          }
        })
      },

      update(newLayers, oldLayers) {
        // manually change opacity of the layers where opacity changed
        // (this is very specific behaviour, but it improves the UX so much that it's worth it)
        const changedOpacities = this.getChangedOpacities(newLayers, oldLayers)
        if (changedOpacities.length) {
          this.updateOpacities(newLayers)
        } else {
          this.recreateLayersIfChanged(newLayers, oldLayers)
        }
      }
    },

    watch: {
      layers: {
        deep: true,
        handler(newValue, oldValue) {
          this.update(newValue, oldValue)
        }
      }
    },
  }
</script>
