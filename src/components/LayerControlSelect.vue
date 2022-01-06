<template>
  <select :name="name" @change="(event) => $emit('change', event)">
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :selected="selected && selected === option.value"
    >{{ option.title }}</option>
  </select>
</template>

<script>
export default {
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
    }
  }
}
</script>
