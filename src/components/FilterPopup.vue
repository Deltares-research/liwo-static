<template>
<pop-up class="filter-popup" title="Filter" @close="$emit('close')">
  <form class="filter-popup__form" id="genericform" novalidate="novalidate">
    <fieldset class="control-group" @change="onProbabilitiesChange" data-tour-id="filter-form-probabilities">
      <legend class="control-label">Kansklasse:</legend>
      <ul class="choice-options">
        <li
          class="choice-options__item"
          v-for="option in probabilityOptions"
          :key="option.id"
        >
          <label
            v-test="'filter-item'"
            class="choice-options__item__label"
            :for="`probability-${option.id}`"
          >
            <input
              class="choice-options__item__checkbox"
              type="checkbox"
              name="probability"
              :id="`probability-${option.id}`"
              :value="option.id"
              v-model="selectedOptions"
            />
            {{ option.title }}
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="control-group">
      <legend class="control-label">Overig:</legend>
      <label
        v-test="'filter-item'"
        class="choice-options__item__label"
        for="probability-imminent-flood"
        data-tour-id="filter-form-flood"
      >
        <input
          class="choice-options__item__checkbox"
          type="checkbox"
          name="probability"
          id="probability-imminent-flood"
          v-model="imminentFlood"
        />
        Dreigende overstroming
      </label>
    </fieldset>
  </form>

</pop-up>
</template>
<script>
import { mapState } from 'vuex'
import { probabilityConfig } from '@/lib/probability-filter'
import store from '@/store'
import PopUp from '@/components/PopUp.vue'

export default {
  components: { PopUp },
  data () {
    return {
      selectedOptions: []
    }
  },
  created () {
    this.selectedOptions = this.selectedProbabilities
  },
  computed: {
    ...mapState(['selectedProbabilities']),
    probabilityOptions () {
      return probabilityConfig
        .filter(config => config.identifier !== 'no_filter')
        .map(({ identifier, title }) => ({
          id: identifier,
          title
        }))
    },
    imminentFlood: {
      get () {
        return this.$store.state.imminentFlood
      },
      set (value) {
        store.commit('setImminentFlood', value)
      }
    }
  },
  methods: {
    onProbabilitiesChange () {
      store.commit('setSelectedProbabilities', { probabilities: this.selectedOptions })
    }
  }
}
</script>

<style>
  .filter-popup__form,
  .filter-popup__form .control-group {
    margin-bottom: 0;
    padding: 30px;
  }

  .filter-popup__form .control-group {
    padding: 0;
  }

  .filter-popup__form .control-group + .control-group {
    margin-top: 15px;
  }

  .filter-popup__form .control-label {
    margin-bottom: 5px;
    padding: 0;
  }

  .filter-popup__total {
    margin-bottom: 0;
  }

  .filter-popup .choice-options__item + .choice-options__item {
    margin-top: 5px;
  }
</style>
