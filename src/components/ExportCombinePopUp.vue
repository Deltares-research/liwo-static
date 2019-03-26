<template>
  <pop-up
    title="Huidige selectie exporteren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form">
      <fieldset>
        <export-url-generator v-model="path"/>

        <div class="control-group">
          <label class="control-label" for="url">URL met gewenste selectie</label>
          <p>Deze link beschrijft de door u gemaakte selectie. U kunt deze zelf opslaan  om uw selectie op een later moment weer op te vragen, of delen met anderen om gezamenlijk een gecombineerd scenario samen te stellen. Let op, u dient deze link zelf op te slaan.</p>
          <div class="controls url-box">
            <input
              class="block"
              id="url"
              type="text"
              name="url"
              :value="url"
              ref="urlTextField"
              readonly
              @focus="selectUrl"
              @click="selectUrl"
            >
          </div>
          <p>U kunt deze link gebruiken gebruiken door de selectie op een later moment te importeren en de selectie te bekijken en eventueel aan te passen alvorens u de combinatie laat maken. U kunt de link ook in uw adresbalk plakken om het resultaat direct op te vragen.</p>
        </div>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <button
              type="button"
              class="btn secondary"
              @click="$emit('close')"
            >
              Sluiten
            </button>
          </div>
        </footer>
      </fieldset>
  </form>
  </pop-up>
</template>

<script>
import PopUp from './PopUp'
import ExportUrlGenerator from './ExportUrlGenerator'

export default {
  components: {
    ExportUrlGenerator,
    PopUp
  },
  data () {
    return {
      path: ''
    }
  },
  computed: {
    url () {
      return `${location.origin}${this.path}`
    }
  },
  methods: {
    selectUrl () {
      this.$refs.urlTextField.select()
    }
  }
}
</script>

<style>
  .combine-popup__form {
    margin-bottom: 0;
  }

  .combine-popup__footer {
    margin-bottom: 0;
  }

  .combine-popup__footer .btn {
    margin-right: 10px;
  }

  .combine-popup__form .url-box {
    margin-bottom: 1rem;
  }
</style>
