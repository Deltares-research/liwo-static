<template>
  <pop-up
    class="change-variant-popup"
    :title="`Selecteer variant voor ${breachName}`"
    @close="$emit('close')"
    disable-scrollbar
    >
      <aside class="change-variant-popup__filters">
        <h3>Filter op variant eigenschappen</h3>

        <div v-for="{ title, values } in sidebarFilters" :key="title" class="change-variant-popup__filter-type">
          <strong>{{ title }}</strong>

          <ul>
            <li v-for="item in values" :key="item.title">
              <label><input type="checkbox" v-model="item.info.filtered"> {{ item.title }} ({{ item.info.count }})</label>
            </li>
          </ul>
        </div>
      </aside>
      <form class="change-variant-popup__results">
        <h3>Beschikbare varianten: ({{ filteredVariants.length  }}):</h3>

        <ul class="change-variant-popup__result-list change-variant-popup__scrollable-list">
          <li v-for="variant in filteredVariants" :key="variant.metadata.title" v-test="'resultItem'">
            <input type="radio" class="accessibility" name="variant" :value="variant.layer" v-model="selectedVariant" :id="`variant-${variant.layer}`" />

            <label
              class="change-variant-popup__result-item"
              :for="`variant-${variant.layer}`">
              <span v-test="'variantName'" v-html="getWrappingTitle(variant)"></span>

              <dl class="change-variant-popup__result-item-props">
                <div :key="name" v-for="{name, value} in getPropsForVariant(variant)">
                  <dt>{{name}}</dt>
                  <dd>{{value}}</dd>
                </div>
              </dl>
            </label>
          </li>
        </ul>

        <footer class="change-variant-popup__footer">
          <button
            class="btn primary"
            @click.prevent="selectVariant"
          >
            Variant selecteren
          </button>
          <button
            class="btn secondary"
            type="reset"
            @click="$emit('close')"
          >
            Annuleer
          </button>
        </footer>
      </form>
  </pop-up>
</template>

<script>
import { mapState } from 'vuex'
import PopUp from './PopUp.vue'

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
    },
    breachName: {
      type: String
    }
  },
  data () {
    return {
      groupedFilters: {},
      selectedVariant: this.currentVariant.layer
    }
  },
  methods: {
    selectVariant () {
      const selectedVariant = this.allVariants.find(variant => variant.layer === this.selectedVariant)

      this.$emit('select:variant', selectedVariant)

      this.$emit('close')
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
    },

    getWrappingTitle(variant) {
      /* Add a zero width space after underscore to force a break */
      return variant.metadata.title.replace(/_/g, '_&#8203;')
    },
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
    max-width: 800px;
    height: 900px;
  }

  .change-variant-popup .pop-up__content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  @media only screen and (min-width: 651px) {
    .change-variant-popup .pop-up__content {
      flex-direction: row;
      min-height: 0;
    }
  }

  .change-variant-popup__footer {
    margin-top: 20px;
    text-align: right;
  }

  .change-variant-popup__footer > button:not(:last-child) {
    margin-right: 10px;
  }

  .change-variant-popup__filters {
    width: 250px;
    flex-shrink: 0;
  }

  .change-variant-popup__filter-type {
    margin-bottom: 10px;
  }

  .change-variant-popup__scrollable-list {
    overflow: auto;
    padding: 2px;
    max-height: 71vh;
    flex-grow: 1;
  }

  .change-variant-popup__results {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
    margin-bottom: 0;
    flex-grow: 1;
  }

  @media only screen and (min-width: 651px) {
    .change-variant-popup__results {
      margin-top: 0;
      margin-left: 3rem;
    }
  }

  .change-variant-popup__result-list {
    list-style: none;
    margin: 0;
    margin-top: .5rem;
    display: flex;
    flex-direction: column;
  }

  .change-variant-popup__result-list > *:not(:first-child) {
    margin-top: .7rem;
  }

  .change-variant-popup__result-item {
    appearance: none;
    border: 0;
    outline: 2px solid var(--lighter-gray);
    background: none;
    width: 100%;
    text-align: left;
    padding: .3rem;
    display: block;
    cursor: pointer;
  }

  input[type=radio]:checked + .change-variant-popup__result-item {
    outline-color: #000;
  }

  .change-variant-popup__result-item-props {
    margin-top: .1rem;
    margin-bottom: 0;
    font-size: .9em;
  }

  .change-variant-popup__result-item-props > * {
    display: inline-flex;
  }

  .change-variant-popup__result-item-props > *:not(:last-child):after {
    content: ',';
    margin-right: .2em;
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
    margin-right: .2em;
  }
</style>
