<template>
  <pop-up class="layer-meta" title="Metadata">
    <template v-slot:icon>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
        <path fill="none" d="M0 0h64v64H0z"/>
        <path d="M53.9 14.1c-.4-2-2-3.6-4-4-6-1-16-1-17.9-1-2 0-12 0-17.9 1-2 .4-3.6 2-4 4-1 6-1 16-1 17.9s0 12 1 17.9c.4 2 2 3.6 4 4 6 1 16 1 17.9 1 2 0 12 0 17.9-1 2-.4 3.6-2 4-4 1-6 1-16 1-17.9 0-6 0-12-1-17.9zM35 48h-6.6l.6-14v-8h6v22zm-3-26c-2.2 0-3.5-1.3-3.5-3.5 0-2 1.2-3.5 3.5-3.5 2.2 0 3.5 1.2 3.5 3.5 0 2-1.2 3.5-3.5 3.5z"/>
      </svg>
    </template>

    <table class="layer-meta__table" v-test="'meta-table'">
      <tr v-for="(value, key) in filteredMetadata" :key="key">
        <template v-if="key === 'gislink'">
          <th class="layer-meta__link">GisLink</th>
          <td class="layer-meta__link">
            <div v-html="sanitizedValue(value)"></div>
            <button
              class="btn primary layer-meta__copy"
              @click="() => handleCopy(metadata.link)"
              :disabled="isCopied"
              type="button"
            >
             <template v-if="!isCopied">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512">
                  <path
                    fill="currentColor"
                    d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                  />
                </svg>
                <span class="sr-only">Kopieer GisLink</span>
             </template>

              <template v-else>
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 448 512">
                  <path
                    fill="currentColor"
                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                  />
                </svg>
                <span class="sr-only">Gekopieerd</span>
              </template>
            </button>
          </td>
        </template>
        <template v-else>
          <th>{{ titleCase(key) }}</th>

          <td v-html="sanitizedValue(value)"></td>
        </template>
      </tr>
    </table>
  </pop-up>
</template>

<script>
import PopUp from '@/components/PopUp.vue'
import sanitizeValue from '@/lib/sanitize-value'

export default {
  props: {
    metadata: {
      Type: Object
    }
  },
  data () {
    return {
      isCopied: false,
    }
  },
  methods: {
    titleCase (string) {
      const s = string.replace(/_/g, ' ').trim()
      return `${s[0].toUpperCase()}${s.substring(1)}`
    },
    sanitizedValue (value) {
      return sanitizeValue(value)
    },
    handleCopy (value) {
      navigator.clipboard.writeText(value)
        .then(() => {
          this.isCopied = true
          setTimeout(() => {
            this.isCopied = false
          }, 2000)
        })
        .catch(err => {
          console.error('Error copying text: ', err)
        })
    },
  },
  computed: {
    filteredMetadata () {
      const asArray = Object.entries(this.metadata)

      // filter values
      const nonId = asArray.filter(([key]) => (key !== 'id'))

      // filter link value
      const nonLink = nonId.filter(([key]) => (key !== 'link'))

      // Convert the key/value array back to an object:
      const result = Object.fromEntries(nonLink)
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

  th.layer-meta__link {
    vertical-align: middle;
  }

  td.layer-meta__link {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  .btn.layer-meta__copy {
    margin-left: auto;
  }

  .btn.layer-meta__copy [class*=icon] {
    margin: 0;
    width: 20px;
    height: 20px;
  }

  .btn.layer-meta__copy:disabled {
    cursor: pointer;
  }
</style>
