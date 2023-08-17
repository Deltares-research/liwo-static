<template>
  <pop-up
    class="change-variant-popup"
    title="Variant kiezen"
    @close="$emit('close')"
    >
    <div class="change-variant-popup__content">
      <aside class="change-variant-popup__filters">
        <p>Filter op variant eigenschappen</p>

        <div v-for="{ title, values } in sidebarFilters" :key="title">
          <strong>{{ title }}</strong>
          <ul>
            <li v-for="item in values" :key="item.title">
              <input type="checkbox" v-model="item.info.filtered"> {{ item.title }} ({{ item.info.count }})
            </li>
          </ul>
        </div>
      </aside>
      <div class="change-variant-popup__results">
        <strong>Beschikbare varianten: ({{ allVariants.length  }}):</strong>

        <ul class="change-variant-popup__result-list">
          <li v-for="variant in filteredVariants" :key="variant.metadata.title">
            <button
              class="change-variant-popup__result-item"
              :class="{'change-variant-popup__result-item--current': isCurrentVariant(variant)}"
              @click="selectVariant(variant)"
            >
              {{ variant.metadata.title }}
              <dl v-for="{name, value} in getPropsForVariant(variant)" :key="name" class="change-variant-popup__result-item-props">
                <dt>{{name}}</dt>
                <dd>{{value}}</dd>
              </dl>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </pop-up>
  </template>

<script>
import { mapState } from 'vuex'
import PopUp from './PopUp'

export default {
  components: {
    PopUp
  },
  props: {
    allVariants: {
      type: Array,
      required: true
    },
    currentVariant: {
      type: Object
    }
  },
  data () {
    return {
      groupedFilters: {}
    }
  },
  methods: {

    selectVariant (variant) {
      this.$emit('select:variant', variant)
    },

    isCurrentVariant (variant) {
      return this.currentVariant && variant.layer === this.currentVariant.layer
    },

    /**
     * Returns a object in the following structure
     * {
     *  "Overschrijdingsfrequentie": { // All filters from variantPropertiesToShow
     *      "10": { // key is value found for "Overschrijdingsfrequentie" in all variants
     *        count: 1 // total amount found for the value "10"
     *        filtered: true // Whether this filter is active
     *      }
     *   }
     * }
     */
    getGroupedFilters () {
      return this.allVariants.reduce((filters, variant) => {
        this.variantPropertiesToShow.forEach(prop => {
          const valueInVariant = variant.properties[prop]

          if (valueInVariant === undefined || valueInVariant === null) {
            return
          }

          if (!filters[prop]) {
            filters[prop] = {}
          }

          if (!filters[prop][valueInVariant]) {
            filters[prop][valueInVariant] = {
              count: 0,
              filtered: true
            }
          }
          filters[prop][valueInVariant].count = filters[prop][valueInVariant].count + 1
        })

        return filters
      }, {})
    },

    getPropsForVariant (variant) {
      return this.variantPropertiesToShow
        .filter(prop => variant.properties[prop] !== null && variant.properties[prop] !== undefined)
        .map(prop => {
          return {
            name: prop,
            value: variant.properties[prop]
          }
        })
    }
  },
  computed: {
    ...mapState(['variantFilterProperties']),

    /* Which to filter on. This is the response from filter_variants */
    variantPropertiesToShow () {
      const layerBreachIds = Object.keys(this.variantFilterProperties)
      return layerBreachIds.length > 0 ? this.variantFilterProperties[layerBreachIds[0]] : []
    },

    sidebarFilters () {
      return this.variantPropertiesToShow
        .filter(prop => prop in this.groupedFilters)
        .map(prop => {
          return {
            title: prop,
            values: Object.entries(this.groupedFilters[prop]).map(([title, info]) => {
              return {
                title,
                info
              }
            })
          }
        })
    },

    filteredVariants () {
      return this.allVariants.filter(variant => {
        return Object.entries(this.groupedFilters).every(([prop, filters]) => {
          // Active filter values within the group
          const activeFilterValues = Object.entries(filters)
            .filter(([_, { filtered }]) => filtered)
            .map(([value]) => value)

          return activeFilterValues.length === 0 || activeFilterValues.some(value => variant.properties[prop] === value)
        })
      })
    }
  },
  async mounted () {
    this.groupedFilters = this.getGroupedFilters()
  }
}
</script>

<style>
  .change-variant-popup .pop-up__modal {
    max-width: 1024px;
  }

  .change-variant-popup__content {
    padding: 1rem;
    display: flex;
  }

  .change-variant-popup__filters {
    width: 300px;
    flex-shrink: 0;
  }

  .change-variant-popup__results {
    margin-left: 3rem;
    flex-grow: 1;
  }

  .change-variant-popup__result-list {
    list-style: none;
    margin: 0;
    margin-top: 1.4rem;
    display: flex;
    flex-direction: column;
  }

  .change-variant-popup__result-list > *:not(:first-child) {
    margin-top: 1rem;
  }

  .change-variant-popup__result-item {
    appearance: none;
    border: 0;
    outline: 2px solid var(--lighter-gray);
    background: none;
    width: 100%;
    text-align: left;
    padding: .5rem;
  }

  .change-variant-popup__result-item--current {
    outline-color: #000;
  }

  .change-variant-popup__result-item-props {
    display: flex;
    margin-top: 1rem;
    margin-bottom: 0;
    font-size: .9em;
  }

  .change-variant-popup__result-item-props dt {
    font-weight: normal;
    margin-bottom: 0;
  }

  .change-variant-popup__result-item-props dd {
    margin: 0;
  }

  .change-variant-popup__result-item-props dt:after {
    content: ':';
  }

  .change-variant-popup__result-item-props dd:not(:last-child):after {
    content: ',';
    margin-right: 1em;
  }
</style>
