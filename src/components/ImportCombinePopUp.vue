<template>
  <pop-up
    title="Selectie importeren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form" @submit.prevent="onSubmit">
      <fieldset>
        <div
          class="control-group"
          :class="{ 'has-error': showError }"
        >
          <label class="control-label" for="url">Link</label>
          <div class="controls url-box">
            <input
              class="block"
              id="url"
              type="text"
              name="url"
              v-model="url"
              v-test="'import-selection-url'"
              data-tour-id="import-selection-url"
            >
            <em v-if="showError" class="errortext">{{ errorText }}</em>
          </div>

          <p>U kunt hier een LIWO-Link invoeren die u eerder heeft opgevraagd of die u van iemand hebt ontvangen. Door op importeren te klikken worden de scenario's aan uw bestaande selectie toegevoegd.</p>
        </div>

        <div class="combine-popup__combine-selected" v-if="currentSelectedIds" data-tour-id="import-url-checkbox">
          <label>
            <input
              type="checkbox"
              v-model="combineWithCurrentSelectedIds"
              v-test="'import-url-checkbox'">
              Samenvoegen met bestaande selectie?
          </label>
        </div>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <button
              class="btn primary"
              v-test="'import-url-button'"
              data-tour-id="import-url-button"
            >
              Importeren
            </button>
            <button
              type="button"
              class="btn secondary"
              @click="$emit('close')"
              data-tour-id="import-url-cancel-button"
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
import _ from 'lodash'
import PopUp from './PopUp.vue'

export default {
  props: {
    currentSelectedIds: {
      type: String,
      default: ''
    }
  },
  components: {
    PopUp
  },
  data () {
    return {
      url: '',
      showError: false,
      errorText: 'Geen valide URL',
      combineWithCurrentSelectedIds: true
    }
  },
  methods: {
    onSubmit () {
      const re = /(\d+)(,\d+)*$/
      const match = this.url.match(re)
      if (!match) {
        this.showError = true
      } else {
        let newIds = match[0].split(',')
        const currentIds = this.currentSelectedIds.split(',')
        if (this.combineWithCurrentSelectedIds) {
          /* TODO: make sure this works for id == 0 */
          newIds = _.uniq([...currentIds, ...newIds].filter(x => x))
        } else {
          newIds = _.uniq(newIds.filter(x => x))
        }

        // go to the new page
        this.$router.push({
          params: { ids: newIds.join(',') },
          query: this.$route.query
        }).then(() => {
          this.$emit('update')
          this.$emit('close')
        })
      }
    }
  },
  watch: {
    url (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.showError = false
      }
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

  .combine-popup__combine-selected {
    margin-bottom: 1rem;
  }

  .combine-popup__combine-selected label {
    display: flex;
    align-items: center;
  }
</style>
