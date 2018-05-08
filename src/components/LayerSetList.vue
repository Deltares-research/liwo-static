<template>
  <section class="layerset-list">
    <h3>{{title}}</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        <router-link :to="{ name: 'viewer', params: {id: item.id} }">{{ item.name }}</router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      validator (items) {
        return items.every(item => (item.name !== undefined && item.id !== undefined))
      }
    }
  }
}
</script>
