<template>
  <select
    :name="name"
    v-model="model"
    v-bind="$attrs"
    @change="handleChange"
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
import { ref, watch } from 'vue'

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
  setup (props, { emit }) {
    const model = ref(props.value !== undefined && props.value !== null ? props.value : '')

    const handleChange = (event) => {
      const value = event.target.value
      emit('onChange', value)
    }

    watch(
      () => props.value,
      (newValue) => {
        model.value = newValue !== undefined && newValue !== null ? newValue : ''
      }
    )

    return {
      model,
      handleChange
    }
  }
}
</script>
