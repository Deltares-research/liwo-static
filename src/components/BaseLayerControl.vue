<script>
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

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

    L.control.layers(baseLayers).addTo(this.mapRef.mapObject);
  }
}
</script>

<style>
.baselayer-control-container {
  margin-right: 2.5rem;
}
.baselayer-control {
  background-color: #fff;
}

.baselayer-control__image {
  vertical-align: middle;
  margin-right: .5rem;
}

.baselayer-control__select,
.baselayer-control__select:active,
.baselayer-control__select:focus {
  border: 0;
  background: transparent;
  outline: 0;
  box-shadow: none;
}
</style>
