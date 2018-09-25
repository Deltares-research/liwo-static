<template>
  <div>
    <h3>{ name }</h3>
  </div>

</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>
