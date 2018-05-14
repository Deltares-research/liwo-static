<template>
  <pop-up class="export-popup" title="Exporteer" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
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
        <li class="choice-cards__item">
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
        Naam<br><small class="help">De naam van het uitvoerbestand</small>
      </label>
      <input type="text" name="name"
        id="exportName" required  autocomplete="off"
        class="export-popup__form-column-item export-popup__textfield">
      <fieldset v-if="exportType === 'print'">
        <div class="export-popup__form-columns">
          <legend>Print opties</legend>
          <label for="layoutname" class="export-popup__form-column-item">
            Layout:
          </label>
          <select name="layoutname" id="layoutname" v-model="layoutName"
            class="export-popup__form-column-item"
          >
            <option value="A4 portrait">A4 portrait</option>
          </select>
          <label class="export-popup__form-column-item">
            Formaat:
          </label>
          <select name="formatname" id="formatname" v-model="formatName"
            class="export-popup__form-column-item"
          >
            <option value="gif">gif</option>
            <option value="pdf">pdf</option>
            <option value="png">png</option>
            <option value="tif">tif</option>
            <option value="tiff">tiff</option>
          </select>
          <label class="export-popup__form-column-item">
            Achtergrondkaart:
          </label>
          <input type="checkbox" name="achtergrond" v-model="background"
            id="achtergrond" class="export-popup__form-column-item">
        </div>
      </fieldset>
      <footer class="export-popup__footer">
        <button class="btn primary" type="submit">Exporteer</button>
        <button  class="btn secondary" type="reset" @click="$emit('close')">Annuleer</button>
      </footer>
    </form>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp'

export default {
  data () {
    return {
      exportType: undefined,
      exportName: '',
      layoutName: 'A4 portrait',
      formatName: 'pdf',
      background: true
    }
  },
  components: { PopUp }
}
</script>

<style>
  .export-popup__content {
    padding: 1rem;
    line-height: 1.125;
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
  }
  .export-popup .choice-cards__item__label {
    text-align: left;
    padding: 1rem .5rem;
  }
  .export-popup .choice-cards__item__label .icon {
    margin-top: -0.5em;
    margin-bottom: -.25em;
  }
  .export-popup__footer button {
    margin-right: 4px;
  }
</style>
