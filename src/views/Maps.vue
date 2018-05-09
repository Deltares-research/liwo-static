<template>
  <article class="maps">
    <header>
      <p>Dit informatiesysteem bevat kaartlagen voor professionals van veiligheidsregio's, waterschappen en Rijkwaterstaat, die nodig zijn voor de voorbereiding op watercrises en overstromingen in Nederland. Het gaat hierbij om crisisbeheersing maar het is ook bruikbaar voor ruimtelijke adaptatie en versterking van zelfredzaamheid.</p>
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

export default {
  name: 'maps',
  data () {
    return { layersets: [] }
  },
  beforeCreate: async function () {
    const layersets = await loadLayersets()
    this.layersets = layersets
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
