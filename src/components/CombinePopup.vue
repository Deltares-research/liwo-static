<template>
  <pop-up
    title="Exporteren"
    @close="$emit('close')"
  >
    <form class="combine-popup__form">
      <fieldset>
        <fieldset class="control-group">
          <legend class="control-label">Kaarttype</legend>
          <div class="controls">

          </div>
          <label
            class="radio block"
            v-for="(option, index) in mergedStyleOptions"
            :key="index"
          >
            <input
              name="field-radio"
              v-model="selectedType"
              :value="option"
              type="radio"
              required
            >
            {{ option }}
          </label>
        </fieldset>

        <footer class="control-group combine-popup__footer">
          <div class="controls">
            <router-link
              :disabled="!selectedType"
              :to="path"
              class="btn primary"
            >Combineren</router-link>
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
import { mapGetters, mapState } from 'vuex'
import PopUp from './PopUp'

export default {
  components: {
    PopUp
  },
  data () {
    return {
      selectedType: null
    }
  },
  computed: {
    ...mapState([
      'selectedBreaches'
    ]),
    ...mapGetters([
      'currentBreachesLayerSet',
    ]),
    path () {
      const { id } = this.$route.params
      const commaSeperatedIds = this.selectedBreaches.length ? this.selectedBreaches.join(',') : ''

      return `/combine/${id}/${this.selectedType}/${commaSeperatedIds}`
    },
    mergedStyleOptions () {
      return this.currentBreachesLayerSet.reduce((acc, layer) => {
        if (!acc.includes(layer.style)) {
          acc.push(layer.style)
        }

        return acc
      }, [])
    }
  },
  mounted () {
    this.selectedType = this.mergedStyleOptions[this.mergedStyleOptions.length - 1]
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
