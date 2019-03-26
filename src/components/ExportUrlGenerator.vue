<template>
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
</template>

<script>
import { mapGetters } from 'vuex'
import PopUp from './PopUp'
import availableBands from '@/lib/available-bands'

export default {
  components: {
    PopUp
  },
  data () {
    return {
      selected: null,
      options: availableBands
    }
  },
  watch: {
    selected () {
      this.$emit('input', this.path)
    }
  },
  computed: {
    ...mapGetters([
      'selectedVariantIds'
    ]),
    path () {
      const commaSeperatedIds = this.selectedVariantIds.join(',')

      return `/combined/${commaSeperatedIds}/${this.selected}`
    }
  },
  mounted () {
    this.selected = this.options[0].id
  }
}
</script>
