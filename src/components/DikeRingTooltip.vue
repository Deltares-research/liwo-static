<template>
  <div>
    <h2>{{ dijkring }}</h2>
    <div>{{ beheerder }}</div>
  </div>
</template>

<script>
export default {
  props: {
    dijkring: String,
    beheerder: String
  }
}
</script>
