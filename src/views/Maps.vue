<template>
<article class="maps">
  <header>
    <p>
      Het Landelijk Informatiesysteem Water en Overstromingen (LIWO) bevat kaartlagen voor professionals die zich
      bezighouden met (de voorbereiding op) wateroverlast en overstromingen in Nederland. Het LIWO is een product
      van het Watermanagementcentrum Nederland (WMCN).
    </p>
  </header>

  <p>
    Voor professionals die niet in de watersector werkzaam zijn en studenten is er
    <a href="https://www.klimaateffectatlas.nl/" rel="noopener noreferrer" target="_blank">www.klimaateffectatlas.nl</a>,
    waar overstromingsinformatie uit LIWO in 'kaartverhalen' wordt toegelicht.
    Voor overige gebruikers is er <a href="https://overstroomik.nl/" rel="noopener noreferrer" target="_blank">www.overstroomik.nl</a>.
  </p>

  <div class="maps__sections">
    <layer-set-list
      v-for="layerSet in layerSets"
      :key="layerSet.id"
      :title="layerSet.name"
      :items="layerSet.layerset"
      />
  </div>
  <div class="notifaction-bar">
    <div class="notification-bar--warning" v-if="error">
      Het is niet gelukt om de lijst met kaarten op te vragen. De bijbehorende melding is: <em>{{ error.message }}</em>.
    </div>
  </div>

</article>
</template>

<script>
// @ is an alias to /src
import LayerSetList from '@/components/LayerSetList.vue'
import { loadLayerSets } from '@/lib/load-layersets'

export default {
  name: 'MapsPage',
  data () {
    return {
      layerSets: [],
      error: null
    }
  },
  beforeCreate: async function () {
    try {
      const layerSets = await loadLayerSets()
      this.layerSets = layerSets
    } catch (error) {
      this.error = error
    }
  },
  components: { LayerSetList }
}
</script>

<style>
.maps {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
.maps__sections {
  display: flex;
  flex-wrap: wrap;
}
.maps__sections > * {
  display: block;
  width: 100%;
}
@media screen and (min-width: 651px) {
  .maps__sections > * {
    width: 50%;
  }
}

@media screen and (min-width: 1200px) {
  .maps__sections > * {
    width: 33%;
  }
}
</style>
