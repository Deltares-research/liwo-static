<template>
  <pop-up class="export-combined-popup" title="Exporteer als zip" @close="cancelExport">
    <form class="export-combined-popup__content export-combined-popup__form-columns" @submit.prevent="exportMap">
      <div
        class="export-combined-popup__notification export-combined-popup__notification--error"
        role="alert"
        aria-live="assertive"
      >
        <p v-if="exportError" class="export-popup__notification-text">{{exportError}}</p>
      </div>

      <div
        class="export-combined-popup__notification export-combined-popup__notification--loading"
        role="status"
        aria-live="polite"
      >
        <template v-if="!eeLayer">
          <div class="export-combined-popup__notification-background" />
          <p class="export-combined-popup__notification-text">Data wordt geladen.</p>
          <div class="lds-dual-ring export-combined-popup__notification-loader" />
        </template>

        <template v-if="exporting">
          <div class="export-combined-popup__notification-background loading-bar" />
          <p class="export-combined-popup__notification-text">Uw export wordt gegenereerd.</p>
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
          @click="cancelExport"
        >
          Annuleer
        </button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp.vue'

import { controller, downloadLiwoScenarios } from '@/lib/export-map-zip'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      exportError: '',
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
      this.exportError = !this.exportScale ? 'Schaal is verplicht' : ''
    },
    async exportMap () {
      if (!this.exportError && !this.exporting) {
        this.exporting = true

        downloadLiwoScenarios({
          scale: this.exportScale,
          band: this.eeLayer.metadata.band,
          liwoIds: this.eeLayer.metadata.liwo_ids,
        })
          .then(json => {
            const result = json
            this.exporting = false
            if (result.error) {
              this.exportError = 'Het door u gevraagde gecombineerde resultaat kan niet geëxporteerd worden. Probeer de schaal te vergroten.'
            }
            if (result.export_url) {
              window.location = result.export_url
              this.$emit('close')
            }
          })
          .catch((error) => {
            this.exportError = 'Het door u gevraagde gecombineerde resultaat kon niet worden geëxporteerd. Probeer de schaal te vergroten.'
            this.exporting = false
            console.warn('Combined result failed:', error)
          })
      }
    },
    cancelExport () {
      this.exporting = false
      if (controller) {
        controller.abort()
      }
      this.$emit('close')
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
    position: relative;
  }
  .export-combined-popup__notification-background {
    background-color: #0b71ab;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
  }
  .export-combined-popup__notification-text {
    position: relative;
    margin: 0;
  }
  .export-combined-popup__notification .export-combined-popup__notification-loader:after {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
