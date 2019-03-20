<template>
  <pop-up
    title="Selectie exporteren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form">
      <fieldset>
        <export-url-generator v-model="path"/>

        <div class="control-group">
          <label class="control-label" for="url">URL</label>
          <div class="controls">
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
        </div>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <button
              type="button"
              class="btn secondary"
              @click="$emit('close')"
            >
              Annuleer
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
</style>
