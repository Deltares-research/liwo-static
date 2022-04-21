<template>
  <aside class="legend-panel">
    <h2 class="legend-panel__title">Legenda</h2>
    <figure v-for="layer in formattedLayers" :key="layer.id" class="legend-panel__legend" v-test="'legend'">
      <template v-if="layer.legend">
        <figcaption class="legend-panel__caption">{{ layer.legend.title }}</figcaption>
        <slot></slot>
        <!-- lookup legend if slot is empty -->
        <img :src="layer.legendImageSrc" alt="">
      </template>
    </figure>
  </aside>
</template>

<script>
import mapConfig from '../map.config'

export default {
  props: {
    layers: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      services: null
    }
  },
  async created () {
    this.services = await mapConfig.getServices()
  },
  computed: {
    formattedLayers () {
      return this.layers.map(layer => {
        if (!layer || !layer.legend) {
          return {}
        }

        const namespace = layer.legend.namespace
        const styleName = layer.legend.style
        const layerId = layer.legend.layer
        const url = this.services && this.services.LEGEND_URL

        return {
          ...layer,
          legendImageSrc: url ? `${url}/${namespace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerId}&STYLE=${styleName}&HEIGHT=16&WIDTH=16&LEGEND_OPTIONS=fontAntiAliasing:true;fontSize:14;mx:0;dx:10;fontName:Verdana;` : ''
        }
      })
    }
  }
}
</script>

<style>
  @import './variables.css';

  .legend-panel {
    max-width: 20rem;
    height: auto;
    background-color: var(--white);
    font-family:  RijksoverheidSansText, Verdana, Arial, sans-serif;
    font-size: 1rem;
  }

  .legend-panel__title {
    margin: 0;
    padding: .25rem;
    background-color: var(--lighter-gray);
    color: var(--black);
    font-weight: normal;
    text-align: center;
  }

  .legend-panel__legend {
    margin: 7px;
  }

  .legend-panel__caption {
    margin-bottom: 4px;
    line-height: 1;
  }

  .legend-panel figure img {
    margin: 0;
  }
</style>
