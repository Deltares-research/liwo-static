<template>
<pop-up
  title="Selectie combineren"
  @close="$emit('close')"
  >
  <form class="combine-popup__form" v-test="'combine-form'">
    <fieldset>
      <fieldset class="control-group">
        <legend class="control-label">Kies het thema waarvoor u scenario's <span v-if="bandCounts">(n={{ featureCount }})</span> wilt combineren:</legend>
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
              :disabled="bandCounts && !bandCounts[option.name]"
              type="radio"
              required
              >
            {{ option.name }} <span title="aantal beschikbare scenario's" v-if="bandCounts">(n={{ bandCounts[option.name] || 0}})</span>
          </label>
        </div>
      </fieldset>

      <footer class="control-group combine-popup__footer" v-if="selected">
        <div class="controls">
          <router-link
            :to="{name: 'combined', params: {ids: path, band: selected,  id: this.layerSetId}}"
            target="_blank"
            @click="$emit('close')"
            class="btn primary"
            v-test="'combine-trigger'"
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
import { getScenarioInfo } from '@/lib/load-breach'

export default {
  components: {
    PopUp
  },
  props: {
    path: {
      type: String,
      required: true
    },
    layerSetId: {
      type: Number,
      required: true
    }
  },
  data () {
    // fill the options based on the english translations
    const breachLayers = BREACH_LAYERS_EN
    const options = _.map(breachLayers, (val, key) => {
      return { id: key, name: val }
    })
    return {
      selected: null,
      options: options,
      bandCounts: null,
      featureCount: 0
    }
  },
  async mounted () {
    const scenarioIds = this.path.split(',').map(_.toNumber)
    const scenarioInfo = await getScenarioInfo(scenarioIds)
    /* extract number of features and bands per layer */
    this.$set(this, 'bandCounts', scenarioInfo.properties.bandCounts)
    this.$set(this, 'featureCount', scenarioInfo.features.length)

    /* select first option (waterlevel) by default */
    this.selected = this.options[0].id
  },
  methods: {
    getBandCount (option) {
      return _.get(this.bandCounts, option.name, '')
    }
  }
}
</script>
