<script>
import { mapbox } from 'mapbox.js'

import 'mapbox.js/theme/style.css'

const MAPBOX_ACCES_TOKEN = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6ImNqbHcwcHFjNjBsdGIza3F1dW5iZjhhY2EifQ.zZkkozZlSRtmB9VgpR9HiQ'

export default {
  render () {
    return ''
  },
  props: [ 'mapRef' ],
  mounted () {
    this.mapRef.mapObject
      .addControl(mapbox.geocoderControl('mapbox.places', {
        position: 'topright',
        accessToken: MAPBOX_ACCES_TOKEN
      }))
  }
}
</script>

<style>

</style>
