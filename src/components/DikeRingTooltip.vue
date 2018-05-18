<template>
  <div>
    <h2>{{ title }}</h2>
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
    title: String,
    admin: String
  },
  computed: {
    adminList () {
      return this.admin.split(';')
    }
  }
}
</script>
