<template>
  <div class="map-image-control">
    <button
      class="map-image-control__button leaflet-bar"
      :disabled="exporting"
      @click.prevent.stop="showPopUp = true"
    >
      <img :src="saveIcon" />
    </button>
    <portal to="portal-target">
      <pop-up v-if="showPopUp" @close="showPopUp = false">
        <form action="" submit.prevent class="map-image-control__form">
          <div class="control-group">
            <h3 class="control-label">Interface</h3>

            <label>
              Toon controls
              <input type="checkbox" v-model="showControls" />
            </label>
          </div>

          <div class="control-group">
            <h3 class="control-label">Formaat</h3>

            <div>
              <label>
                <input type="radio" id="CurrentSize" value="CurrentSize" v-model="exportSize">
                Current size
              </label>
            </div>
            <div>
              <label>
                <input type="radio" id="A4Landscape" value="A4Landscape page" v-model="exportSize">
                A4 landscape
              </label>
            </div>
            <div>
              <label>
                <input type="radio" id="A4Portrait" value="A4Portrait page" v-model="exportSize">
                A4 Portrait
              </label>
            </div>

          </div>
            <button class="btn primary" @click.prevent.stop="exportAsImage">Exporteren als afbeelding</button>
        </form>
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
  methods: {
    exportAsImage () {
      this.showPopUp = false

      this.map.printPlugin._toggleControls(this.showControls)

      // wait for modal to close
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
</style>
