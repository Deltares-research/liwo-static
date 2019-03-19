<template>
   <fieldset class="control-group">
      <legend class="control-label">Kaarttype</legend>
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
import { mapState, mapGetters } from 'vuex'
import PopUp from './PopUp'

export default {
  components: {
    PopUp
  },
  data () {
    return {
      selected: null,
      options: [{
        name: 'Waterdiepte',
        id: 'waterdepth'
      }]
    }
  },
  watch: {
    selected () {
      this.$emit('input', this.path)
    }
  },
  computed: {
    ...mapGetters([
      'selectedVariants'
    ]),
    path () {
      const { id } = this.$route.params
      const commaSeperatedIds = this.selectedVariants.join(',')

      return `/combine/${id}/${commaSeperatedIds}/${this.selected}`
    }
  },
  mounted () {
    this.selected = this.options[0].id
  }
}
</script>
