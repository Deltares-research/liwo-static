<template>
  <pop-up class="export-popup" title="Exporteer" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
      <fieldset class="export-popup__notification export-popup__notification--error" v-if="formErrors.length">
        <b>Graag de volgende velden aanvullen:</b>
        <ul>
          <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
        </ul>
      </fieldset>
      <fieldset class="export-popup__notification export-popup__notification--loading" v-if="exporting">
        <b>Uw export wordt gegenereerd.</b>
      </fieldset>
      <label class="export-popup__form-column-item">Exporteer als:</label>
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
        <!-- disable for now -->
        <li class="choice-cards__item" v-if="false">
          <input type="radio" name="export" v-model="exportType"
            id="export-print" value="print"
            class="sr-only choice-cards__item__radio export-popup__export-input"
          >
          <label class="choice-cards__item__label export-popup__export-label" for="export-print">
            <span aria-hidden="true" class="icon icon-file-pdf icon-2x"></span>
            <span>Afbeelding</span>
          </label>
        </li>
      </ul>
      <label class="export-popup__form-column-item">
        Naam:<br><small class="help">De naam van het uitvoerbestand</small>
      </label>
      <input type="text" name="name"
        id="export-name" autocomplete="off" v-model="exportName"
        class="export-popup__form-column-item export-popup__textfield">
      <footer class="export-popup__footer">
        <button class="btn primary" @click.prevent="exportMap">Exporteer</button>
        <button class="btn secondary" type="reset" @click="$emit('close')">Annuleer</button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp'

import exportZip from '@/lib/export-map-zip'

export default {
  props: {
    mapLayers: Array,
    mapObject: Object
  },
  data () {
    return {
      formErrors: [],
      exporting: false, // starts false and after form validates becomes true
      exportType: 'zip',
      exportName: ''
    }
  },
  components: { PopUp },
  methods: {
    exportMap: function () {
      if (!this.exportType) this.formErrors.push('Kies export type')
      if (!this.exportName) this.formErrors.push('Export naam is verplicht')

      if (this.formErrors && this.formErrors.length === 0) { this.exporting = true }

      if (this.exportType === 'zip') {
        const layers = this.mapLayers.map(
          layer => {
            // TODO: make this consistent
            // this is actually the id of the variant
            return layer.layer
          }).join()
        exportZip({ name: this.exportName, layers })
      } else {
        console.warn('export type not supported', this.exportType)
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
