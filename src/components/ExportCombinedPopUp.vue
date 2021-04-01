<template>
  <pop-up class="export-popup" title="Exporteer" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
      <div class="export-popup__notification export-popup__notification--loading" v-if="!eeLayer">
        <b>Wacht tot de data geladen is.</b>
      </div>
      <div class="export-popup__notification export-popup__notification--loading" v-if="!eeLayer">
        <b>Uw export wordt gegenereerd.</b>
      </div>
      <p class="export-popup__form-column-item">Exporteer als:</p>
      <ul class="export-popup__form-column-item choice-cards export-popup__radio-group">
        <li class="choice-cards__item">
          <input type="radio" name="export" v-model="exportType"
            id="export-zip" value="zip"
            class="sr-only choice-cards__item__radio export-popup__export-input"
          >
          <label class="radio choice-cards__item__label export-popup__export-label" for="export-zip">
            <span aria-hidden="true" class="icon icon-file-zip icon-2x"></span>
            <span>Zip</span>
          </label>
        </li>
      </ul>
      <label class="export-popup__form-column-item" for="export-name">
        Schaal:<br><small class="help">Schaal in meters</small>
      </label>
      <input type="number" name="scale"
        id="export-scale" autocomplete="off" v-model="exportScale"
        class="export-popup__form-column-item export-popup__textfield">
      <footer class="export-popup__footer" v-if="eeLayer">
        <button class="btn primary" @click.prevent="exportMap">Exporteer</button>
        <button class="btn secondary" type="reset" @click="$emit('close')">Annuleer</button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp'
import mapConfig from '../map.config'
import store from '@/store'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      exportType: 'zip',
      exportScale: 50,
      exporting: false
    }
  },
  components: { PopUp },
  computed: {
    eeLayer () {
      let eeLayers = this.mapLayers.filter(layer => layer.metadata.mapid)
      if (eeLayers.length < 1) {
        return null
      }
      const eeLayer = eeLayers[0]
      return eeLayer
    },
    otherLayers () {
      let otherLayers = this.mapLayers.filter(layer => !(layer.metadata.mapid))
      return otherLayers
    }
  },
  methods: {
    async exportMap () {
      this.exporting = true
      let eeLayer = this.eeLayer
      let body = {
        liwo_ids: eeLayer.metadata.liwo_ids,
        band: eeLayer.metadata.band,
        scale: parseFloat(this.exportScale),
        'export': true
      }
      const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }

      // Lookup the hydro engine url
      let services = await mapConfig.getServices()
      const HYDRO_ENGINE_URL = services.HYDRO_ENGINE_URL
      let url = `${HYDRO_ENGINE_URL}/get_liwo_scenarios`

      /* get the id of the layerSet */
      let layerSetId = this.otherLayers[0].layerSet.id

      let promise = fetch(url, requestOptions)
        .then(resp => {
          return resp.json()
        })
        .then(json => {
          let result = json
          if (result.error) {
            let notification = {
              message: 'Het door u gevraagde gecombineerde resultaat kan niet geëxporteerd worden. Probeer de schaal te vergroten.',
              type: 'warning',
              show: true
            }
            store.commit('addNotificationById', { id: layerSetId, notification })
          }
          return result
        })
        .catch((error) => {
          this.exporting = false
          let notification = {
            message: `Het door u gevraagde gecombineerde resultaat kon niet worden geëxporteerd. Probeer de schaal te vergroten.`,
            type: 'warning',
            show: true
          }
          console.warn('Combined result failed:', error)
          // notifiy of failure
          store.commit('addNotificationById', { id: layerSetId, notification })
          return null
        })

      promise.then(
        result => {
          this.exporting = false
          if (result.export_url) {
            window.location = result.export_url
          }
          this.$emit('close')
        }
      )
    }
  }
}
</script>

<style>
  .export-popup__content {
    padding: 1.5rem;
  }

  .export-popup__form-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .export-popup__form-columns > * {
    width: 100%;
    margin: 0 0 1rem 0;
    padding: 0;
  }
  .export-popup__form-column-item {
    display: block;
    width: calc(50% - 1rem);
  }
  .export-popup .choice-cards {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
  .export-popup .choice-cards__item {
    width: 100%;
    flex: 0 1 100%;
    margin-bottom: 10px;
  }
  .export-popup .choice-cards__item__label {
    text-align: left;
    margin: 0;
    padding: 8px 16px;
  }
  .export-popup .choice-cards__item__radio:checked+.choice-cards__item__label:after {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
  }
  .export-popup .btn:focus {
    text-decoration: none;
  }
  .export-popup__footer button {
    margin-right: 10px;
  }
  .export-popup__notification {
    color: #ffffff;
    background: gray;
    padding: 10px;
    border-radius: 3px;
  }
  .export-popup__notification--error {
    background:red;
  }
  .export-popup__notification--loading {
    background: #0b71ab;
  }
</style>
