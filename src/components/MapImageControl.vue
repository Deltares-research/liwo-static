<template>
  <button
    class="map-image-control leaflet-bar"
    @click="exportAsImage"
  >
    <img :src="saveIcon" />
  </button>
</template>

<script>
import domToImage from 'dom-to-image'
import { saveAs } from 'file-saver'

import saveIcon from '../img/save_alt.svg'

export default {
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      saveIcon
    }
  },
  computed: {
    imgSrc () {
      return this.active ? this.exitFullscreenIcon : this.fullscreenIcon
    }
  },
  methods: {
    async exportAsImage () {
      const blob = await domToImage.toBlob(this.map.getContainer())
      saveAs(blob, 'export.png')
    }
  }
}
</script>

<style>
.map-image-control {
  width: 30px;
  height: 30px;
  box-sizing: content-box;
  padding: 0;
  background-color: #fff;
  cursor: pointer;
}
</style>
