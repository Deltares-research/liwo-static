<template>
  <div class="layer-panel">
    <h3 class="layer-panel__title">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M55 33L32 49 9 33l-4 2v2l26 19a2 2 0 0 0 2 0l26-19v-2l-4-2z"/>
        <path d="M31 45a2 2 0 0 0 2 0l26-19v-2L33 5a2 2 0 0 0-2 0L5 24v2l26 19z"/>
      </svg>
      Kaartlagen
    </h3>
    <ul class="layer-panel__list">
      <li
        class="layer-panel__list-item"
        v-for="layerGroup in layerGroups"
        :key="layerGroup.properties.id"
        @click="setSelectedLayerGroupId(layerGroup.properties.id)"
        v-if="layerGroup.layers"

      >
        <layer-control
          :active="isActive(layerGroup)"
          :metadata="activeLayer(layerGroup).properties.metadata"
          :id="layerGroup.properties.id"
          :title="layerGroup.properties.title"
          :subtitle="activeLayer(layerGroup).properties.title"
          @toggle="layerGroup.properties.visible != layerGroup.properties.visible"
          @change-opacity="setOpacity(layerGroup, $event)"
          />
      </li>
    </ul>
    <button class="layer-panel__export" @click="$emit('open-export')">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M18 17v2H6v-2H3v4c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-4h-3z"/>
        <path d="M11 16.5a1.4 1.4 0 0 0 2 0l5.8-7.3a1.4 1.4 0 0 0-1.7-2l-3.1 2V3.4c0-1-1-1.4-2-1.4s-2 .3-2 1.4v5.8l-3-2a1.4 1.4 0 0 0-1.8 2l5.7 7.3z"/>
      </svg>
      Kaart exporteren
    </button>
  </div>
</template>
<script>
import _ from 'lodash'
import LayerControl from '@/components/LayerControl'

export default {
  props: {
    layerGroups: {
      type: Array,
      validator (layerGroups) {
        return layerGroups.every(
          layerGroup => (
            // every layer group should have a title and id
            layerGroup.properties.title !== undefined &&
              layerGroup.properties.id !== undefined
          )
        )
      }
    }
  },
  methods: {
    setOpacity (layerGroup, {opacity}) {
      layerGroup.properties.opacity = opacity
    },
    activeLayer (layerGroup) {
      return _.first(layerGroup.layers)
    },
    setSelectedLayerGroupId (id) {
      this.$store.commit('setSelectedLayerGroupId', id)
    },
    isActive (layerGroup) {
      return layerGroup.id === this.selectedLayerGroupId
    }
  },
  components: {
    LayerControl
  }
}
</script>

<style>
@import './variables.css';

.layer-panel {
  width: 320px;
  height: auto;
  background-color: var(--white);
}
.layer-panel__title,
.layer-panel__export {
  background-color: var(--yellow);
  line-height: 44px;
  font-size: 1.2em;
  padding: 4px;
  color: var(--black);
  margin-bottom: 0;
}
.layer-panel__export {
  width: 100%;
  background-color: var(--white);
  text-align: left;
  font-weight: bold;
  border: none;
  box-shadow: var(--shadow);
}
</style>
