<template>
  <pop-up class="export-popup" title="Exporteer" @close="$emit('close')">
    <form class="export-popup__content export-popup__form-columns">
      <label>Exporteer als:</label>
      <div class="radio-group">
        <input type="radio" name="export" v-model="exportType"
          id="export-zip" value="zip"
          class="sr-only export-popup__export-input"
        >
        <label class="export-popup__export-label" for="export-zip">
          <span>Zip</span>
        </label>
        <input type="radio" name="export" v-model="exportType"
          id="export-print" value="print"
          class="sr-only export-popup__export-input"
        >
        <label class="export-popup__export-label" for="export-print">
          <span>Afbeelding</span>
        </label>

      </div>
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
      layoutName: 'A4 Portrait',
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
  .export-popup__footer {
    display: flex;
    justify-content: flex-start;
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
  .export-popup__form-columns > select,
  .export-popup__form-columns > .radio-group {
    display: block;
    width: 40%;
  }
</style>
