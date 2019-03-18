<template>
  <article class="maps">
    <header>
      <p>
        Dit informatiesysteem bevat kaartlagen voor professionals, die nodig zijn voor de voorbereiding op wateroverlast en
        overstromingen in Nederland. De ruimtelijke informatie is ondergebracht onder het kopje 'Kaarten' en is voor iedereen
        toegankelijk. Het gaat hierbij om crisisbeheersing (preparatie en respons) maar het is ook bruikbaar
        voor ruimtelijke adaptatie. Kaarten worden vanuit het LIWO ook beschikbaar gesteld aan andere systemen voor het
        verhogen van het waterbewustzijn en de versterking van zelfredzaamheid.
      </p>
    </header>
    <div class="maps__sections">
      <layerset-list
        v-for="layerset in layersets"
        :key="layerset.id"
        :title="layerset.name"
        :items="layerset.layerset"
      />
    </div>
  </article>
</template>

<script>
// @ is an alias to /src
import LayersetList from '@/components/LayersetList'
import { loadLayersets } from '@/lib/load-layersets'

const PAGE_TITLE = 'Kaarten'

export default {
  name: 'maps',
  data () {
    return { layersets: [] }
  },
  beforeCreate: async function () {
    const layersets = await loadLayersets()
    this.layersets = layersets
  },
  mounted () {
    this.$store.commit('setPageTitle', PAGE_TITLE)
  },
  components: { LayersetList }
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
