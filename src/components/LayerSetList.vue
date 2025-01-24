<template>
<section class="layerset-list">
  <h3 class="layerset-list__header" :data-tour-id="`layerset-${index}`">{{ title }}</h3>
  <ul class="layerset-list__list">
    <li class="layerset-list__list-item"
        v-for="item in items"
        :key="item.id"
        >
      <!-- id here is a layerSetId -->
      <router-link
        :to="{ name: getName(item), params: {id: item.id} }"
        :data-tour-id="`layerset-map-${item.id}-link`"
      >
        {{ item.name }}
      </router-link>
    </li>
  </ul>
</section>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'LayerSetList',
  props: {
    title: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      validator (items) {
        return items.every(item => (item.name !== undefined && item.id !== undefined))
      }
    }
  },
  methods: {
    getName (item) {
      return _.get(item, 'route', 'viewer')
    }
  }
}
</script>

<style>
.layerset-list__list {
  margin-left: 1em;
  margin-bottom: 1rem;
}

.layerset-list__header {
  width: max-content;
}

.layerset-list__list-item::before {
  content: "›";
  float: left;
  margin-left: -1em;
}
</style>
