<template>
  <pop-up
    title="Selectie combineren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form">
      <fieldset>
        <export-url-generator v-model="path"/>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <a
              :href="url"
              class="btn primary"
              target="_blank"
              rel="noopener"
              @click="$emit('close')"
            >Combineren</a>
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
      return `${location.pathname}#/${this.path}`
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
