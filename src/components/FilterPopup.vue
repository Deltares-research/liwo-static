<template>
<pop-up class="filter-popup" title="Filter" @close="$emit('close')">
  <form class="filter-popup__form" id="genericform" novalidate="novalidate">
    <p class="filter-popup__total">Totaal aantal scenatio's: xx</p>
    <fieldset class="control-group">
      <legend class="control-label">Doorbraaklocaties:</legend>
      <ul class="choice-options">
        <li class="choice-options__item" v-for="location in locations" :key="location.id">
          <label
            v-test="'filter-item'"
            class="choice-options__item__label"
            :for="`probability-${location.id}`"
          >
            <input
              class="choice-options__item__checkbox"
              type="checkbox"
              name="probability"
              :id="`probability-${location.id}`"
              :value="location.value"
              v-model="selectedLocations"
            />
            {{ location.title }} - xx scenario's
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="control-group">
      <legend class="control-label">Kansklasse:</legend>
      <ul class="choice-options">
        <li class="choice-options__item" v-for="probability in probabilities" :key="probability.identifier">
          <label
            v-test="'filter-item'"
            class="choice-options__item__label"
            :for="`probability-${probability.identifier}`"
          >
            <input
              class="choice-options__item__checkbox"
              type="checkbox"
              name="probability"
              :id="`probability-${probability.identifier}`"
              :value="probability.identifier"
              v-model="selectedProbabilities"
            />
            {{ probability.title }} - xx scenario's
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
      >
        <input
          class="choice-options__item__checkbox"
          type="checkbox"
          name="probability"
          id="probability-imminent-flood"
          value="imminent-flood"
          v-model="imminentFlood"
        />
        Dreigende overstroming
      </label>
    </fieldset>
  </form>

</pop-up>
</template>
<script>
import { probabilityConfig } from '@/lib/probability-filter'
import PopUp from '@/components/PopUp'

export default {
  components: {
    PopUp
  },
  data () {
    return {
      locations: [{ id: 'gebied-a', title: 'Gebied A', value: 'gebied-a' }, { id: 'gebied-b', title: 'Gebied B', value: 'gebied-b' }],
      selectedLocations: [],
      probabilities: probabilityConfig,
      selectedProbabilities: [],
      imminentFlood: false
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
    margin-top: 15px;
    padding: 0;
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
