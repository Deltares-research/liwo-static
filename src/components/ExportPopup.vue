<template>
  <pop-up class="export-popup" title="Exporteer als zip" @close="cancelExport">
    <form class="export-popup__content export-popup__form-columns" @submit.prevent="exportMap">
      <div
        class="export-popup__notification export-popup__notification--error"
        role="alert"
        aria-live="assertive"
      >
        <p v-if="exportError" class="export-popup__notification-text">{{exportError}}</p>
      </div>

      <div
        class="export-popup__notification export-popup__notification--loading"
        role="status"
        aria-live="polite"
      >
        <template v-if="exporting">
          <div class="export-popup__notification-background loading-bar" />
          <p class="export-popup__notification-text">Uw export wordt gegenereerd. Dit duurt maximaal 3 minuten.</p>
        </template>
      </div>

      <label class="export-popup__form-column-item" for="export-name">
        <span>Naam:</span>
        <span class="help">De naam van het uitvoerbestand</span>
      </label>
      <input
        class="export-popup__form-column-item export-popup__textfield"
        type="text"
        name="name"
        id="export-name"
        autocomplete="off"
        v-model="exportName"
        v-test="'name-input'"
        required
        data-tour-id="layer-export-name"
      >
      <footer class="export-popup__footer">
        <button
          class="btn primary"
          @click="validateForm"
          v-test="'export-file-button'"
          data-tour-id="layer-export-button"
        >
          Exporteer
        </button>
        <button
          class="btn secondary"
          type="reset"
          @click="cancelExport"
          data-tour-id="layer-export-cancel-button"
        >
          Annuleer
        </button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp.vue'

import { controller, downloadZipFileDataLayers } from '@/lib/export-map-zip'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      exportError: '',
      exporting: false, // starts false and after form validates becomes true
      exportName: ''
    }
  },
  components: { PopUp },
  methods: {
    validateForm () {
      this.exportError = !this.exportName ? 'Export naam is verplicht' : ''
    },
    exportMap () {
      if (!this.exportError && !this.exporting) {
        this.exporting = true
        const layers = this.mapLayers.map(
          layer => {
            // TODO: make this consistent
            // this is actually the id of the variant
            return layer.layer
          }).join()

        downloadZipFileDataLayers({ name: this.exportName, layers })
          .then(() => {
            this.exporting = false
            this.$emit('close')
          })
          .catch(() => {
            this.exportError = 'Er is een fout opgetreden bij het exporteren van de kaart. Probeer het later opnieuw.'
            this.exporting = false
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
    display: flex;
    flex-direction: column;
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
    font-weight: bold;
  }
  .export-popup__notification:empty {
    display: none;
  }
  .export-popup__notification--error {
    background: red;
  }
  .export-popup__notification--loading {
    position: relative;
  }
  .export-popup__notification-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 0;
  }
  .export-popup__notification-text {
    position: relative;
    margin: 0;
  }
  .export-popup__notification .export-popup__notification-loader:after {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
