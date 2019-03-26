<template>
  <pop-up
    title="Huidige selectie exporteren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form">
      <fieldset>
        <export-url-generator v-model="path"/>

        <div class="control-group">
          <label class="control-label" for="url">Link behorende bij uw selectie</label>
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
          <p>Deze link bevat de gemaakte selectie. U kunt deze opslaan en op een later moment importeren om een selectie aan te passen en een gecombineerd scenario opnieuw te maken. U kunt de selectie ook delen met anderen om zo samen met anderen een selectie te maken. Let op, u dient deze link zelf op te slaan.</p>
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
