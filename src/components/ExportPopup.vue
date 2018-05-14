<template>
  <pop-up class="export-popup" title="Exporteer" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
      <label>Exporteer als:</label>
      <ul class="choice-cards export-popup__radio-group">
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
      <label>Naam<br><small class="help">De naam van het uitvoerbestand</small></label>
      <input type="text" name="name"
        id="exportName" required  autocomplete="off">
      <fieldset v-if="exportType === 'print'">
        <div class="export-popup__form-columns">
          <legend>Print opties</legend>
          <label for="layoutname">Layout:</label>
          <select name="layoutname" id="layoutname" v-model="layoutName">
            <option value="A4 portrait">A4 portrait</option>
          </select>
          <label>Formaat:</label>
          <select name="formatname" id="formatname" v-model="formatName">
            <option value="gif">gif</option>
            <option value="pdf">pdf</option>
            <option value="png">png</option>
            <option value="tif">tif</option>
            <option value="tiff">tiff</option>
          </select>
          <label>Achtergrondkaart:</label>
          <input type="checkbox" name="achtergrond"  v-model="background"
            id="achtergrond">
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
  .export-popup__form-columns > label,
  .export-popup__form-columns > input,
  .export-popup__form-columns > select {
    display: block;
    width: 40%;
  }
  .export-popup__radio-group {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 40%;
    text-align: left;
  }
  .export-popup .choice-cards__item__label {
    text-align: left;
  }
  .export-popup .choice-cards__item__label .icon {
    margin-top: -0.5em;
    margin-bottom: -.25em;
  }
  .export-popup__footer button {
    margin-right: 4px;
  }
</style>
