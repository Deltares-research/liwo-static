<template>
  <aside
    :class="{
      'legend-panel': true,
      'legend-panel--active': legendIsShown,
    }"
  >
    <button
      class="legend-panel__title"
      aria-controls="legend"
      v-test="'legend-button'"
      :aria-expanded="legendIsShown"
      :aria-label="`Klap legenda ${legendIsShown ? 'in' : 'uit'}`"
      @click="toggleLegend"
      :disabled="formattedLayers.length === 1"
    >
      Legenda
      <img
        v-if="formattedLayers.length > 1"
        class="legend-panel__collapse-icon"
        :src="`${publicPath}icons/baseline-keyboard_arrow_up-24px.svg`"
        role="presentation"
        alt=""
      />
    </button>
    <template v-if="legendIsShown">
      <figure
        v-for="layer in formattedLayers"
        :key="layer.id"
        id="legend"
        class="legend-panel__legend"
        v-test="'legend'"
        aria-live="polite"
      >
        <template v-if="layer.legend">
          <figcaption class="legend-panel__caption">
            {{ layer.legend.title }}
          </figcaption>
          <slot v-if="!layer.legendImageSrc"></slot>
          <!-- lookup legend if slot is empty -->
          <img
            class="legend-panel__image"
            :src="layer.legendImageSrc"
            alt=""
            @load="() => addLoadedImageByLayerId(layer.id)"
            @error="() => addLoadedImageByLayerId(layer.id)"
          />
          <div
            v-if="loadedImages.indexOf(layer.id) < 0"
            class="legend-panel__image-loader lds-dual-ring"
          ></div>
        </template>
      </figure>
    </template>
  </aside>
  <div
    v-if="legendIsShown"
    class="legend-panel__overlay"
    @click="hideLegend"
  ></div>
</template>

<script>
import mapConfig from "../map.config";

export default {
  props: {
    layers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      services: null,
      customMapConfig: null,
      isOpen: false,
      loadedImages: [],
      // path where the server runs (should end in a /)
      publicPath: import.meta.env.BASE_URL,
    };
  },
  async created() {
    this.services = await mapConfig.getServices();
    this.customMapConfig = mapConfig.getCustomMapConfig(this.services);
  },
  methods: {
    toggleLegend() {
      if (this.legendIsShown) {
        this.hideLegend();
      } else {
        this.showLegend();
      }
    },
    showLegend() {
      if (this.formattedLayers.length > 1) {
        this.isOpen = true;
      }
    },
    hideLegend() {
      if (this.formattedLayers.length > 1) {
        this.loadedImages = [];
        this.isOpen = false;
      }
    },
    addLoadedImageByLayerId(layerId) {
      this.loadedImages.push(layerId);
    },
  },
  computed: {
    legendIsShown() {
      return this.formattedLayers.length === 1 || this.isOpen;
    },
    formattedLayers() {
      const uniqueLayers = this.layers.filter(
        (layer, index, self) =>
          index ===
          self.findIndex((item) => item.legend.title === layer.legend.title)
      );

      return uniqueLayers.map((layer) => {
        if (!layer || !layer.legend) {
          return {};
        }

        let legendImageSrc = '';

        if (this.customMapConfig?.[layer.id]) {
          legendImageSrc = this.customMapConfig[layer.id].legendImageSrc || '';
        }

        if (!legendImageSrc) {
          const namespace = layer.legend.namespace;
          const styleName = layer.legend.style;
          const layerId = layer.legend.layer;
          const url = this.services && this.services.LEGEND_URL;
          legendImageSrc = url
            ? `${url}/${namespace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerId}&STYLE=${styleName}&HEIGHT=16&WIDTH=16&LEGEND_OPTIONS=fontAntiAliasing:true;fontSize:14;mx:0;dx:10;fontName:Verdana;`
            : '';
        }

        return {
          ...layer,
          legendImageSrc,
        };
      });
    },
  },
};
</script>

<style>
@import "./variables.css";

.legend-panel {
  max-width: 20rem;
  min-width: 10rem;
  height: auto;
  background-color: var(--white);
  font-family: RijksoverheidSansText, Verdana, Arial, sans-serif;
  font-size: 1rem;
  border-radius: 0.25rem;
}

@media print {
  .legend-panel {
    display: none;
  }

  .legend-panel--active {
    display: block;
  }
}

.legend-panel__title {
  margin: 0;
  padding: 0.5rem;
  width: 100%;
  background-color: var(--white);
  color: var(--black);
  border: 2px solid var(--light-gray);
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}

.legend-panel--active .legend-panel__title {
  background-color: var(--lighter-gray);
  border-radius: 0;
  border: none;
}

.legend-panel__legend {
  padding: 7px;
  padding-bottom: 10px;
  margin: 0;
}

.legend-panel__legend:not(:last-child) {
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 10px;
}

.legend-panel__caption {
  margin-bottom: 4px;
  line-height: 1;
}

.legend-panel__image {
  margin: 0;
}

.legend-panel .legend-panel__image-loader:after {
  width: 20px;
  height: 20px;
}

.legend-panel__collapse-icon {
  transition: transform 0.25s ease-in-out;
}

@media print {
  .legend-panel__collapse-icon {
    display: none;
  }
}

.legend-panel--active .legend-panel__collapse-icon {
  transform: rotate(180deg);
}

.legend-panel__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
