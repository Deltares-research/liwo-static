<script>
import L from 'leaflet'

const controlIdPrefix = 'custom-control--'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    position: {
      type: String
    },
    map: {
      type: Object
    }
  },
  methods: {
    getMap( mapId="map" ) {
      let parent = this.$parent

      while (!parent.$refs[mapId]) {
        try {
          parent = parent.$parent
        }
        catch (e) {
          return null
        }
      }

      return parent.$refs.map.mapObject
    }
  },
  mounted () {
    const slot = this.$slots.default[0]
    const name = this.name

    L.Control[ name ] = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div');

        div.id = `${controlIdPrefix}${name}`

        return div
      },

      onRemove: function () {
        console.log(`Removed custom control ${name}`)
      }
    })

    this.control = new L.Control[ name ]({ position: 'bottomleft' }).addTo(this.getMap())
  },
  render(createElement) {
    console.log('DEZEEEE', this.$slots.default[0])
    return createElement('div', this.$slots.default[0])
  }
}
</script>

<style>

</style>
