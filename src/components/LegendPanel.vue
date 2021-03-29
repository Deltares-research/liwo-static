<template>
  <aside class="legend-panel">
    <h2 class="legend-panel__title">Legenda</h2>
    <figure class="legend-panel__legend">
      <figcaption class="legend-panel__caption">{{ layer.legend.title }}</figcaption>
      <slot></slot>
      <!-- lookup legend if slot is empty -->
      <img :src="legendImageSrc" alt="" v-if="!this.$slots.default">
    </figure>
  </aside>
</template>

<script>
import mapConfig from '../map.config'
import { extractUnit } from '@/lib/load-layersets'

export default {
  data () {
    return {
      services: null
    }
  },
  async created () {
    this.services = await mapConfig.getServices()
  },
  computed: {
    legendImageSrc () {
      const namespace = this.layer.legend.namespace
      const styleName = this.layer.legend.style
      const layerId = this.layer.legend.layer
      const url = this.services && this.services.LEGEND_URL
      if (!url) {
        return ''
      }
      return `${url}/${namespace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerId}&STYLE=${styleName}&HEIGHT=16&WIDTH=16&LEGEND_OPTIONS=fontAntiAliasing:true;fontSize:14;mx:0;dx:10;`
    },
    unit () {
      return extractUnit(this.layer.legend.title)
    }
  },
  props: {
    layer: {
      type: Object,
      required: true
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
  }
  .legend-panel__title {
    text-align: center;
    font-weight: normal;
    margin: 0;
    padding: .25rem;
    background-color: var(--lighter-gray);
    color: var(--black);
  }
  .legend-panel__caption {
    text-align: center;
    margin-bottom: 0.25rem;
  }
  .legend-panel__legend {
    padding: 1rem;
    margin-bottom: 0;
  }

</style>
