<template>
  <pop-up class="layer-meta" title="Metadata" @close="$emit('close')">
    <template slot="icon">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
      </svg>
    </template>
    <template>
      <table class="layer-meta__table" v-test="'meta-table'">
        <tr
          v-for="(value, key) in noIdMetadata"
          :key="key"
        >
          <th>{{titleCase(key)}}</th>
          <td v-html="value"></td>
        </tr>
      </table>
    </template>
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
  computed: {
    noIdMetadata () {
      const asArray = Object.entries(this.metadata)

      // filter values
      const nonId = asArray.filter(([key, value]) => (key !== 'id'))

      // Convert the key/value array back to an object:
      const result = Object.fromEntries(nonId)
      return result
    }
  },
  components: {
    PopUp
  }
}
</script>

<style>
  @import './variables.css';

  .layer-meta {
    box-shadow: var(--shadow);
  }

  .layer-meta__table {
    width: 100%;
    height: 100%;
    background-color: var(--white);
    border: 0;
    margin:0;
  }
  .layer-meta__table tr:nth-child(even) {
    background-color: var(--lighter-gray);
  }
  .layer-meta__table th,
  .layer-meta__table td {
    vertical-align: top;
    background: none;
  }
</style>
