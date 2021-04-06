<template>
  <div class="map-image-control">
    <button
      title="Export as image"
      class="map-image-control__button leaflet-bar"
      :disabled="exporting"
      @click.prevent.stop="showPopUp = true"
    >
      <img :src="saveIcon" alt="" />
    </button>
    <!-- the modal needs to be rendered outside of the map, the portal takes care of that -->
    <portal to="portal-target">
      <pop-up v-if="showPopUp" @close="showPopUp = false">
        <form action="" submit.prevent class="map-image-control__form">
          <div class="control-group">
            <h3 class="control-label">Interface</h3>

            <label>
              <input type="checkbox" v-model="showControls" />
              Toon controls
            </label>
          </div>

          <div class="control-group">
            <h3 class="control-label">Formaat</h3>

            <div v-for="size in sizes" :key="size.name">
              <label>
                <input type="radio" :value="size.className" v-model="exportSize">
                {{ size.name }}
              </label>
            </div>
          </div>

          <div class="control-group">
            <h3 class="control-label">Locatie</h3>

            <p class="map-image-control__location">Coördinaten linksboven: {{ origin.join(', ') }}</p>
            <p>Zoomniveau: {{ zoomLevel }}</p>
          </div>

          <button class="btn primary" @click.prevent.stop="exportAsImage">Exporteren als afbeelding</button>
        </form>

        <!-- TODO: add coordinates of top left corner -->
      </pop-up>
    </portal>
  </div>
</template>

<script>
import PopUp from './PopUp'
import saveIcon from '../img/save_alt.svg'

export default {
  components: {
    PopUp
  },
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showControls: true,
      exportSize: 'CurrentSize',
      exporting: false,
      showPopUp: false,
      saveIcon
    }
  },
  computed: {
    sizes () {
      return this.map.printPlugin.options.sizeModes
    },
    zoomLevel () {
      return this.map.getZoom()
    },
    origin () {
      const originPoint = this.map.getPixelOrigin()
      const { lat, lng } = this.map.unproject(originPoint)

      return [lat.toFixed(4), lng.toFixed(4)]
    }
  },
  methods: {
    exportAsImage () {
      this.showPopUp = false

      this.map.printPlugin._toggleControls(this.showControls)

      // wait for modal to close
      // when executed directly, the modal is visible in the export
      setTimeout(async () => {
        this.map.printPlugin.printMap(this.exportSize, 'export')
      }, 500)
    }
  }
}
</script>

<style>
.map-image-control {
  z-index: 1000;
}

.map-image-control__button {
  width: 30px;
  height: 30px;
  box-sizing: content-box;
  padding: 0;
  background-color: #fff;
  cursor: pointer;
}

.map-image-control__form {
  padding: 30px;
  margin-bottom: 0;
}

.map-image-control__form h3 {
  color: #000;
}

.map-image-control__location {
  margin-bottom: 0;
}

/* hide easyPrint control, because we want to use our custom button */
.leaflet-control-easyPrint {
  display: none;
}
</style>
