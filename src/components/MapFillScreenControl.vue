<template>
  <button
    class="map-fill-screen-control leaflet-bar"
    @click="toggle"
  >
    <img :src="imgSrc" />
  </button>
</template>

<script>
import fullscreenIcon from '../img/fullscreen.svg'
import exitFullscreenIcon from '../img/fullscreen_exit.svg'

export default {
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      active: false,
      originalStyles: '',
      fullscreenIcon,
      exitFullscreenIcon
    }
  },
  computed: {
    imgSrc () {
      return this.active ? this.exitFullscreenIcon : this.fullscreenIcon
    }
  },
  mounted () {
    const container = this.map.getContainer()
    this.originalStyles = container.style.cssText
  },
  methods: {
    toggle () {
      const container = this.map.getContainer()

      if (this.activated) {
        container.style.cssText = this.originalStyles
      } else {
        container.style.cssText = 'position:fixed;left:0;top:0;height:100%;width:100%;z-index:3000;background-color:#fff;'
      }

      this.map.invalidateSize()

      this.activated = !this.activated
    }
  }
}
</script>

<style>
.map-fill-screen-control {
  width:30px;
  height:30px;
  box-sizing:content-box;
  padding:0;
  background-color:#fff;
  cursor: pointer;
}
</style>
