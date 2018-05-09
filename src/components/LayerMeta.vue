<template>
  <pop-up class="layer-meta" title="Metadata">
    <table class="layer-meta__table">
      <tr
        v-for="(value, key) in metadata"
        :key="key"
        v-if="(key !== 'id')"
      >
        <th>{{titleCase(key)}}</th>
        <td v-html="value"></td>
      </tr>
    </table>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp'

export default {
  props: {
    metadata: {
      Type: Object
    }
  },
  methods: {
    titleCase (string) {
      const s = string.replace(/_/g, ' ').trim()
      return `${s[0].toUpperCase()}${s.substring(1)}`
    }
  },
  components: {
    PopUp
  },
}
</script>

<style>
@import './variables.css';

.layer-meta__table {
  width: 100%;
  height: 100%;
  background-color: var(--white);
  border: 0;
}
.layer-meta__table tr:nth-child(even) {
  background-color: var(--light-gray);
}
.layer-meta__table th,
.layer-meta__table td {
  vertical-align: top;
}
</style>
