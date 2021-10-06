<template>
<pop-up class="export-popup" title="Filter" @close="$emit('close')">
  <form class="contact-form " id="genericform" novalidate="novalidate">
    <fieldset class="control-group control-group">
      <legend class="control-label">Kans:</legend>
      <div class="controls">
        <ul class="choice-cards">
          <li class="choice-cards__item" v-for="item in probabilityConfig" :key="item.identifier">
            <input
              class="choice-cards__item__radio"
              type="radio"
              name="probability"
              :id="`probability-${item.identifier}`"
              :value="item.identifier"
              :checked="probability === item.identifier"
              @change="setProbability(item.identifier)"
            >
            <label
              v-test="'filter-item'"
              class="choice-cards__item__label"
              :for="`probability-${item.identifier}`">
              {{ item.title }}
              <span class="icon-check" aria-hidden="true"></span>
            </label>
          </li>
        </ul>
      </div>
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
  props: {
    probability: {
      type: String,
      // take the first probability as  default
      default: probabilityConfig[0].id
    }

  },
  data () {
    return {
      probabilityConfig
    }
  },
  methods: {
    setProbability (val) {
      this.$emit('update:probability', val)
    }
  }
}
</script>
