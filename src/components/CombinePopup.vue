<template>
<pop-up
  title="Selectie combineren"
  @close="$emit('close')"
  >
  <form class="combine-popup__form">
    <fieldset>
      <fieldset class="control-group">
        <legend class="control-label">Kies het thema waarvoor u scenario's wilt combineren:</legend>
        <div class="controls">
          <label
            class="radio block"
            v-for="option in options"
            :key="option.id"
            >
            <input
              name="field-radio"
              v-model="selected"
              :value="option.id"
              type="radio"
              required
              >
            {{ option.name }}
          </label>
        </div>
      </fieldset>

      <footer class="control-group combine-popup__footer">
        <div class="controls">
          <router-link
            :to="{name: 'combined', params: {ids: path, band: selected}}"
            target="_blank"
            @click="$emit('close')"
            class="btn primary"
            >
            Combineren
          </router-link>
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
import _ from 'lodash'
import PopUp from './PopUp'
import { BREACH_LAYERS_EN } from '@/lib/liwo-identifiers'
export default {
  components: {
    PopUp
  },
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data () {
    // fill the options based on the english translations
    let breachLayers = BREACH_LAYERS_EN
    let options = _.map(breachLayers, (val, key) => {
      return {id: key, name: val}
    })
    return {
      selected: null,
      options: options
    }
  },
  mounted () {
    this.selected = this.options[0].id
  }
}
</script>
