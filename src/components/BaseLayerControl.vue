<script>
import L from 'leaflet'

export default {
  render () {
    return ''
  },
  props: [ 'tileLayers', 'mapRef' ],
  mounted () {
    const baseLayers = this.tileLayers.reduce((baseLayers, layer) => {
      baseLayers[layer.title] = L.tileLayer(layer.url, { tms: layer.tms })
      return baseLayers
    }, {})

    this.mapRef.mapObject.addLayer(baseLayers[this.tileLayers[0].title])

    L.control.layers(baseLayers).addTo(this.mapRef.mapObject)
  }
}
</script>

<style>

  /* Leaflet css override */
  .leaflet-control-layers-toggle {
      background-position: 0 -208px;
  }
  .leaflet-control-layers-toggle {
    width: 52px;
    height: 52px;
    background-size: 52px 520px;
  }
</style>
