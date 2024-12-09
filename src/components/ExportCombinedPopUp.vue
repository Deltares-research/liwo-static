<template>
  <pop-up class="export-combined-popup" title="Exporteer als zip" @close="$emit('close')">
    <form class="export-combined-popup__content export-combined-popup__form-columns" @submit.prevent="exportMap">
      <div
        class="export-combined-popup__notification export-combined-popup__notification--error"
        role="alert"
        aria-live="assertive"
      >
        <p v-if="hasError" class="export-popup__notification-text">Schaal is verplicht</p>
      </div>

      <div
        class="export-combined-popup__notification export-combined-popup__notification--loading"
        role="status"
        aria-live="polite"
      >
        <template v-if="exporting || !eeLayer">
          <p v-if="exporting" class="export-combined-popup__notification-text">Uw export wordt gegenereerd.</p>
          <p v-if="!eeLayer" class="export-combined-popup__notification-text">Data wordt geladen.</p>
          <div class="lds-dual-ring export-combined-popup__notification-loader" />
        </template>
      </div>
      <label class="export-combined-popup__form-column-item" for="export-scale">
        <span>Schaal:</span>
        <span class="help">Schaal in meters</span>
      </label>
      <input
        class="export-combined-popup__form-column-item export-combined-popup__textfield"
        type="number"
        name="scale"
        id="export-scale"
        autocomplete="off"
        v-model="exportScale"
        required
      />
      <footer v-if="eeLayer" class="export-combined-popup__footer">
        <button
          class="btn primary"
          @click="validateForm"
          v-test="'export-combined-button'"
        >
          Exporteer
        </button>
        <button
          class="btn secondary"
          type="reset"
          @click="$emit('close')"
        >
          Annuleer
        </button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp.vue'
import mapConfig from '../map.config'
import store from '@/store'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      hasError: false,
      exportScale: 50,
      exporting: false
    }
  },
  components: { PopUp },
  computed: {
    eeLayer () {
      const eeLayers = this.mapLayers.filter(layer => layer.metadata.mapid)
      if (eeLayers.length < 1) {
        return null
      }
      const eeLayer = eeLayers[0]
      return eeLayer
    },
    otherLayers () {
      const otherLayers = this.mapLayers.filter(layer => !(layer.metadata.mapid))
      return otherLayers
    }
  },
  methods: {
    validateForm () {
      this.hasError = !this.exportScale
    },
    async exportMap () {
      if (!this.hasError && !this.exporting) {
        this.exporting = true
        const eeLayer = this.eeLayer
        const body = {
          liwo_ids: eeLayer.metadata.liwo_ids,
          band: eeLayer.metadata.band,
          scale: parseFloat(this.exportScale),
          export: true
        }
        const requestOptions = {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }

        // Lookup the hydro engine url
        const services = await mapConfig.getServices()
        const hydroEngine = services.HYDRO_ENGINE_URL
        const url = `${hydroEngine}/get_liwo_scenarios`

        /* get the id of the layerSet */
        const layerSetId = this.otherLayers[0].layerSet.id

        const promise = fetch(url, requestOptions)
          .then(resp => {
            this.exporting = false
            return resp.json()
          })
          .then(json => {
            const result = json
            if (result.error) {
              const notification = {
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
            const notification = {
              message: 'Het door u gevraagde gecombineerde resultaat kon niet worden geëxporteerd. Probeer de schaal te vergroten.',
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
            if (result.export_url) {
              window.location = result.export_url
            }
            this.$emit('close')
          }
        )
      }
    }
  }
}
</script>

<style>
  .export-combined-popup__content {
    padding: 1.5rem;
  }
  .export-combined-popup__form-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .export-combined-popup__form-columns > * {
    width: 100%;
    margin: 0 0 1rem 0;
    padding: 0;
  }
  .export-combined-popup__form-column-item {
    display: flex;
    flex-direction: column;
    width: calc(50% - 1rem);
  }
  .export-combined-popup .choice-cards {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
  .export-combined-popup .choice-cards__item {
    width: 100%;
    flex: 0 1 100%;
    margin-bottom: 10px;
  }
  .export-combined-popup .choice-cards__item__label {
    text-align: left;
    margin: 0;
    padding: 8px 16px;
  }
  .export-combined-popup .choice-cards__item__radio:checked+.choice-cards__item__label:after {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
  }
  .export-combined-popup .btn:focus {
    text-decoration: none;
  }
  .export-combined-popup__footer button {
    margin-right: 10px;
  }
  .export-combined-popup__notification {
    color: #ffffff;
    background: gray;
    padding: 10px;
    border-radius: 3px;
    font-weight: bold;
  }
  .export-combined-popup__notification:empty {
    display: none;
  }
  .export-combined-popup__notification--error {
    background: red;
  }
  .export-combined-popup__notification--loading {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0b71ab;
  }
  .export-combined-popup__notification-text {
    margin: 0;
  }
  .export-combined-popup__notification .export-combined-popup__notification-loader:after {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
