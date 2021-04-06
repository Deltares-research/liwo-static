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
      exitFullscreenIcon,
      windowWidth: 0,
      windowHeight: 0
    }
  },
  computed: {
    imgSrc () {
      return this.active ? this.exitFullscreenIcon : this.fullscreenIcon
    }
  },
  watch: {
    windowWidth () {
      if (this.active) {
        const container = this.map.getContainer()
        container.style.cssText = `position:fixed;left:0;top:0;height:${this.windowHeight}px;width:${this.windowWidth}px;z-index:3000;background-color:#fff;`
      }
    },
    windowHeight () {
      if (this.active) {
        const container = this.map.getContainer()
        container.style.cssText = `position:fixed;left:0;top:0;height:${this.windowHeight}px;width:${this.windowWidth}px;z-index:3000;background-color:#fff;`
      }
    }
  },
  mounted () {
    const container = this.map.getContainer()
    this.originalStyles = container.style.cssText

    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight

    console.log(this.windowWidth)

    window.addEventListener('resize', () => {
      this.windowWidth = container.innerWidth
      this.windowHeight = container.innerHeight
    })
  },
  methods: {
    toggle () {
      const container = this.map.getContainer()

      if (this.active) {
        container.style.cssText = this.originalStyles
      } else {
        // width & height need to be numbers, because otherwise leaflet-easyprint does not co-oparate well (height can not be determined)
        container.style.cssText = `position:fixed;left:0;top:0;height:${this.windowHeight}px;width:${this.windowWidth}px;z-index:3000;background-color:#fff;`
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
