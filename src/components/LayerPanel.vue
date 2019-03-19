<template>
  <div class="layer-panel">
    <div class="layer-panel__content">
      <h3 class="layer-panel__title" @click="resetToMapLayers">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
          <path fill="none" d="M0 0h64v64H0z"/>
          <path d="M55 33L32 49 9 33l-4 2v2l26 19a2 2 0 0 0 2 0l26-19v-2l-4-2z"/>
          <path d="M31 45a2 2 0 0 0 2 0l26-19v-2L33 5a2 2 0 0 0-2 0L5 24v2l26 19z"/>
        </svg>
        Kaartlagen
      </h3>

      <div class="layer-panel__body">
        <layer-panel-item
          v-for="layerSet in layerSets"
          :key="layerSet.id"
          :layers="layerSet.layers"
          :layerId="layerSet.id"
          :title="layerSet.layerSetTitle"
        />
      </div>

      <footer
        class="layer-panel__actions"
      >
        <template v-if="viewerType === 'combine'">
          <button
            v-if="selectedBreaches.length"
            class="layer-panel__action"
            @click="$emit('open-combine')"
          >
            Selectie combineren
          </button>
          <button
            class="layer-panel__action"
            @click="$emit('open-import-combine')"
          >
            Selectie importeren
          </button>
          <button
            v-if="selectedBreaches.length"
            class="layer-panel__action"
            @click="$emit('open-export-combine')"
          >
            Selectie exporteren
          </button>
        </template>

        <button
          v-else
          class="layer-panel__action"
          @click="$emit('open-export')"
        >
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M18 17v2H6v-2H3v4c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-4h-3z"/>
            <path d="M11 16.5a1.4 1.4 0 0 0 2 0l5.8-7.3a1.4 1.4 0 0 0-1.7-2l-3.1 2V3.4c0-1-1-1.4-2-1.4s-2 .3-2 1.4v5.8l-3-2a1.4 1.4 0 0 0-1.8 2l5.7 7.3z"/>
          </svg>
          Kaart exporteren
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LayerControl from '@/components/LayerControl'
import LayerPanelItem from '@/components/LayerPanelItem'

export default {
  props: {
    layerSets: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState([
      'viewerType',
      'selectedBreaches'
    ])
  },
  methods: {
    setSelectedLayerId (id) {
      this.$store.commit('setSelectedLayerId', id)
    },
    toggleLayerVisibilityById (id) {
      this.$store.commit('toggleLayerById', id)
    },
    resetToMapLayers () {
      this.$store.commit('resetToMapLayers')
    }
  },
  components: {
    LayerControl,
    LayerPanelItem
  }
}
</script>

<style>
  @import './variables.css';

  .layer-panel {
    width: 320px;
    height: 100%;
    background-color: var(--white);
    max-height: calc(100vh - 23rem);
  }

  .layer-panel__content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .layer-panel__body {
    flex: 1;
    overflow: auto;
  }

  .layer-panel__title,
  .layer-panel__action {
    background-color: var(--yellow);
    line-height: 44px;
    font-size: 1.2em;
    padding: 4px;
    color: var(--black);
    margin-bottom: 0;
  }

  .layer-panel__action {
    width: 100%;
    background-color: var(--white);
    text-align: left;
    font-weight: bold;
    border: none;
    box-shadow: var(--shadow);
  }

  .layer-panel__back-button {
    float: right;
  }
</style>
