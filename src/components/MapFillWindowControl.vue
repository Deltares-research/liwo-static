<template>
  <button
    title="Enlarge map"
    class="map-fill-screen-control leaflet-bar"
    @click="toggle"
  >
    <img :src="imgSrc" alt="" />
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
      initialStyles: '',
      fullscreenIcon,
      exitFullscreenIcon,
      windowWidth: 0,
      windowHeight: 0
    }
  },
  computed: {
    imgSrc () {
      return this.active ? this.exitFullscreenIcon : this.fullscreenIcon
    },
    activeStyles () {
      // width & height need to be numbers, otherwise leaflet-easyprint does not co-oparate well (height can not be determined)
      return `position:fixed;left:0;top:0;height:${this.windowHeight}px;width:${this.windowWidth}px;z-index:3000;background-color:#fff;`
    }
  },
  watch: {
    windowWidth () {
      if (this.active) {
        const container = this.map.getContainer()
        container.style.cssText = this.activeStyles
      }
    },
    windowHeight () {
      if (this.active) {
        const container = this.map.getContainer()
        container.style.cssText = this.activeStyles
      }
    }
  },
  mounted () {
    const container = this.map.getContainer()
    // store initial styles so we use them when this.active is set to false
    this.initialStyles = container.style.cssText

    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight

    this.listener = window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    })
  },
  beforeDestroy () {
    window.removeEventListener(this.listener)
  },
  methods: {
    toggle () {
      const container = this.map.getContainer()

      if (this.active) {
        container.style.cssText = this.initialStyles
      } else {
        container.style.cssText = this.activeStyles
      }

      this.map.invalidateSize()

      this.active = !this.active
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
