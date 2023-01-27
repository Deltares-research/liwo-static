<template>
  <select
    :name="name"
    v-model="model"
    v-bind="$attrs"
  >
    <option
      v-for="option in options"
      :value="option.value"
      :key="option.value"
      :disabled="option.disabled"
    >
      {{ option.title }}
    </option>
  </select>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    selected: {
      required: false,
      default: undefined
    },
    value: {
      type: [String, Number]
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    model: {
      get () {
        return this.value !== undefined || this.value !== null ? this.value : ''
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>
