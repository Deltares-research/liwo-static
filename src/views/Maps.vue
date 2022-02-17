<template>
<article class="maps">
  <header>
    <p>
      Het Landelijk Informatiesysteem Water en Overstromingen (LIWO) bevat kaartlagen voor professionals die zich
      bezighouden met (de voorbereiding op) wateroverlast en overstromingen in Nederland. Het LIWO is een product
      van het Watermanagementcentrum Nederland (WMCN).
    </p>
  </header>
  <div>
    <h2>Gebruik</h2>
    <p>
      Het juist duiden van beschikbare kaartlagen vereist specialistische kennis. Deze kennis is beschikbaar bij
      waterbeheerders. Het wordt daarom aanbevolen om deze kennis te betrekken, zowel bij ruimtelijke adaptatie als bij
      wateroverlast en (de voorbereiding op) overstromingen.
    </p>
    <p>Voor niet-professionele gebruikers is er <a href="https://www.overstroomik.nl">www.overstroomik.nl</a>.</p>
    <p>
      Voor uitleg over het gebruik en de gebruikershandleiding kunt u terecht op de <a href="https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/">Helpdesk Water</a>. Hier vindt u ook
      contactgegevens voor het aanvragen van LIWO-opleidingen.
    </p>
    <h2>Kaarten</h2>
    <p>
      Dit informatiesysteem bevat kaartlagen voor professionals, die nodig zijn voor de voorbereiding op wateroverlast en
      overstromingen in Nederland. De ruimtelijke informatie is ondergebracht onder het kopje 'Kaarten' en is voor iedereen
      toegankelijk. Het gaat hierbij om crisisbeheersing (preparatie en respons) maar het is ook bruikbaar
      voor ruimtelijke adaptatie. Kaarten worden vanuit het LIWO ook beschikbaar gesteld aan andere systemen voor het
      verhogen van het waterbewustzijn en de versterking van zelfredzaamheid.
    </p>
  </div>
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
import LayerSetList from '@/components/LayerSetList'
import { loadLayerSets } from '@/lib/load-layersets'

export default {
  name: 'Maps',
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
