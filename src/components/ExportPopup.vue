<template>
  <pop-up class="export-popup" title="Exporteer als zip" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns" @submit.prevent="exportMap">
      <div
        class="export-popup__notification export-popup__notification--error"
        role="alert"
        aria-live="assertive"
      >
        <p v-if="hasError" class="export-popup__notification-text">Export naam is verplicht</p>
      </div>

      <div
        class="export-popup__notification export-popup__notification--loading"
        role="status"
        aria-live="polite"
      >
        <template v-if="exporting">
          <p class="export-popup__notification-text">Uw export wordt gegenereerd.</p>
          <div class="lds-dual-ring export-popup__notification-loader" />
        </template>
      </div>

      <label class="export-popup__form-column-item" for="export-name">
        <span>Naam:</span>
        <span class="help">De naam van het uitvoerbestand</span>
      </label>
      <input
        id="export-name"
        class="export-popup__form-column-item export-popup__textfield"
        name="name"
        autocomplete="off"
        v-model="exportName"
        type="text"
        v-test="'name-input'"
        required
      />
      <footer class="export-popup__footer">
        <button class="btn primary" type="submit" @click="validateForm" v-test="'export-file-button'">Exporteer</button>
        <button class="btn secondary" type="reset" @click="$emit('close')">Annuleer</button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp.vue'

import exportZip from '@/lib/export-map-zip'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      hasError:false,
      exporting: false, // starts false and after form validates becomes true
      exportName: ''
    }
  },
  components: { PopUp },
  methods: {
    validateForm () {
      this.hasError = !this.exportName
    },
    exportMap () {
      if (!this.hasError && !this.exporting) {
        this.exporting = true
        const layers = this.mapLayers.map(
          layer => {
            // TODO: make this consistent
            // this is actually the id of the variant
            return layer.layer
          }).join()

        exportZip({ name: this.exportName, layers })
          .finally(() => {
            this.exporting = false
            this.$emit('close')
          })
      }
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
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0b71ab;
  }
  .export-popup__notification-text {
    margin: 0;
  }
  .export-popup__notification .export-popup__notification-loader:after {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
