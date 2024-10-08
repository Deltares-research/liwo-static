<template>
  <pop-up class="export-popup" title="Exporteer als zip" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
      <div class="export-popup__notification export-popup__notification--error" v-if="formErrors.length">
        <b>Graag de volgende velden aanvullen:</b>
        <ul>
          <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
        </ul>
      </div>
      <div class="export-popup__notification export-popup__notification--loading" v-if="exporting">
        <b>Uw export wordt gegenereerd.</b><div class="lds-dual-ring export-popup__notification-loader"></div>
      </div>
      <label class="export-popup__form-column-item" for="export-name">
        Naam:<br><small class="help">De naam van het uitvoerbestand</small>
      </label>
      <input
        class="export-popup__form-column-item export-popup__textfield"
        type="text"
        name="name"
        id="export-name"
        autocomplete="off"
        v-model="exportName"
        v-test="'name-input'"
        data-tour-id="layer-export-name"
      >
      <footer class="export-popup__footer">
        <button
          class="btn primary"
          @click.prevent="exportMap"
          v-test="'export-file-button'"
          data-tour-id="layer-export-button"
        >
          Exporteer
        </button>
        <button
          class="btn secondary"
          type="reset"
          @click="$emit('close')"
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
      exportName: ''
    }
  },
  components: { PopUp },
  methods: {
    exportMap: function () {
      if (!this.exportName) this.formErrors.push('Export naam is verplicht')
      if (this.formErrors && this.formErrors.length === 0) { this.exporting = true }

      const layers = this.mapLayers.map(
        layer => {
          // TODO: make this consistent
          // this is actually the id of the variant
          return layer.layer
        }).join()

      exportZip({ name: this.exportName, layers })
        .finally(() => {
          this.exporting = false
        })
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
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0b71ab;
  }
  .export-popup__notification .export-popup__notification-loader:after {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
