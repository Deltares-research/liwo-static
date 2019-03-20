<template>
  <pop-up
    title="Selectie importeren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form" @submit.prevent="onSubmit">
      <fieldset>
        <div class="control-group">
          <label class="control-label" for="url">URL</label>
          <div class="controls">
            <input
              class="block"
              id="url"
              type="text"
              name="url"
              v-model="url"
            >
          </div>
        </div>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <button
              class="btn primary"
            >
              Importeren
            </button>
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
      url: ''
    }
  },
  methods: {
    onSubmit () {
      const url = new URL(this.url)
      const path = url.hash ? url.hash.split('#')[1] : url.path
      const parsedUrl = this.$router.match(path)

      if (parsedUrl.params.layerIds) {
        const layerIds = parsedUrl.params.layerIds.split(',')
        this.$store.dispatch('setActiveLayersFromVariantIds', layerIds)
      }

      this.$emit('close')
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
