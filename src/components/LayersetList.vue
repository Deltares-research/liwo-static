<template>
  <section class="layerset-list">
    <h3>{{ title }}</h3>
    <ul class="layerset-list__list">
      <li class="layerset-list__list-item"
        v-for="item in items"
        :key="item.id"
      >
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

<style>
  .layerset-list__list {
    margin-left: 1em;
    margin-bottom: 1rem;
  }
  .layerset-list__list-item::before {
    content: "›";
    float: left;
    margin-left: -1em;
  }
</style>
