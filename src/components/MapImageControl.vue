<template>
  <div class="map-image-control">
    <button
      title="Export as image"
      class="leaflet-control-image map-image-control__button leaflet-bar"
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
            <label for="name" class="control-label"> Bestandsnaam </label>
            <div>
              <input
                type="text"
                name="name"
                id="name"
                autocomplete="off"
                v-model="name"
                class="map-image-control__text-input"
                ref="nameInput"
                @click="selectNameText"
              />
            </div>
          </div>

          <div class="control-group">
            <h3 class="control-label">Interface</h3>

            <div v-for="control in controls" :key="control.class">
              <label>
                <input type="checkbox" v-model="control.enabled" />
                {{ control.name }}
              </label>
            </div>
          </div>

          <div class="control-group">
            <h3 class="control-label">Formaat</h3>

            <div v-for="size in sizes" :key="size.name">
              <label>
                <input
                  type="radio"
                  :value="size.className"
                  v-model="exportSize"
                />
                {{ size.name }}
              </label>
            </div>
          </div>

          <div class="control-group">
            <h3 class="control-label">Locatie</h3>

            <p class="map-image-control__location">
              Coördinaten: {{ origin.join(', ') }}
            </p>
            <p>Zoomniveau: {{ zoomLevel }}</p>
          </div>

          <button class="btn primary" @click.prevent.stop="exportAsImage">
            Exporteren als afbeelding
          </button>
        </form>
      </pop-up>
    </portal>
  </div>
</template>

<script>
import PopUp from './PopUp'
import saveIcon from '../img/save_alt.svg'

// hardcoded list of available controls in interface
// used to hide controls in export
// TODO: add control class to list if new control is added
const allControls = [
  'legend-panel',
  'leaflet-control-map-rose',
  'leaflet-control-fill-window',
  'leaflet-control-geocoder',
  'leaflet-control-zoom',
  'leaflet-control-browser-print',
  'leaflet-control-image',
  'leaflet-control-layers',
  'leaflet-control-scale'
]

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
      name: 'export',
      exportSize: 'CurrentSize',
      exporting: false,
      showPopUp: false,
      saveIcon,
      controls: [
        {
          name: 'Noordpijl',
          className: 'leaflet-control-map-rose',
          enabled: false
        },
        {
          name: 'Schaalindicator',
          className: 'leaflet-control-scale',
          enabled: false
        },
        {
          name: 'Legenda',
          className: 'legend-panel',
          enabled: false
        }
      ]
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
      // get enabled controls
      const enabledControlClasses = this.controls
        .filter(({ enabled }) => enabled)
        .map(({ className }) => className)
      // exclude enabled controls from list of classes to hide
      const disabledControlClasses = allControls.filter(controlClass => !enabledControlClasses.includes(controlClass))

      // hide all controls except the ones enabled
      this.map.printPlugin._toggleClasses(disabledControlClasses)

      // wait for modal to close
      // when executed directly, the modal is visible in the export
      this.showPopUp = false
      setTimeout(async () => {
        this.map.printPlugin.printMap(this.exportSize, this.name)

        this.map.on('easyPrint-finished', () => {
          this.map.printPlugin._toggleClasses(disabledControlClasses, true)
        })
      }, 500)
    },
    selectNameText () {
      this.$refs.nameInput.select()
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

.map-image-control__text-input {
  display: block;
  width: 20rem;
}

/* hide easyPrint control, because we want to use our custom button */
.leaflet-control-easyPrint {
  display: none;
}
</style>
