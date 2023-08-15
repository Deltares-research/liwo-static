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

        <ul v-for="variant in filteredVariantsWithProps" :key="variant.title">
          <li>{{ variant.title }}</li>
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
      type: Object,
      required: true
    }
  },
  data () {
    return {
      groupedAvailableFilters: {}
    }
  },
  methods: {
    updateFilter (item) {
      console.log(item)
      item.info.filtered = false
    },
    getGroupedAvailableFilters () {
      return this.allVariants.reduce((acc, variant) => {
        this.variantPropertiesToShow.forEach(prop => {
          const valueInVariant = variant.properties[prop]

          if (valueInVariant === undefined || valueInVariant === null) {
            return
          }

          if (!acc[prop]) {
            acc[prop] = {}
          }

          if (!acc[prop][valueInVariant]) {
            acc[prop][valueInVariant] = {
              count: 0,
              filtered: true
            }
          }
          acc[prop][valueInVariant].count = acc[prop][valueInVariant].count + 1
        })

        return acc
      }, {})
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
        .filter(prop => prop in this.groupedAvailableFilters)
        .map(prop => {
          return {
            title: prop,
            values: Object.entries(this.groupedAvailableFilters[prop]).map(([title, info]) => {
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
        return Object.entries(this.groupedAvailableFilters).some(([prop, filters]) => {
          const activeFilterValues = Object.entries(filters)
            .filter(([_, { filtered }]) => filtered)
            .map(([value]) => value)

          return activeFilterValues.some(value => variant.properties[prop] === value)
        })
      })
    },
    filteredVariantsWithProps () {
      return this.filteredVariants.map(variant => {
        return {
          title: variant.metadata.title
        }
      })
    }
  },
  async mounted () {
    console.log(this.allVariants)
    this.groupedAvailableFilters = this.getGroupedAvailableFilters()
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
  }
</style>
