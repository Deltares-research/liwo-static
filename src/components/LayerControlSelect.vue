<template>
  <select
    :name="name"
    v-model="internalValue"
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
    modelValue: {
      type: [String, Number]
    }
  },
  emits: ['update:modelValue'],
  computed: {
    internalValue: {
      get () {
        return this.modelValue !== undefined || this.modelValue !== null ? this.modelValue : ''
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
