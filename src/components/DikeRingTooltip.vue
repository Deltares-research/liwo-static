<template>
  <div>
    <h2>{{ dijkring }}</h2>
    <div>
      <h3>Beheerder(s)</h3>
      <ul>
        <li
          v-for="admin in adminList"
          :key="admin"
        >
          {{ admin }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dijkring: String,
    beheerder: String
  },
  computed: {
    adminList () {
      return this.beheerder.split(';')
    }
  }
}
</script>
