<template>
<div class="about site-main">
  <div>
    <section class="section">
      <h2 data-class="section-head">Tips voor sitebezoek</h2>
      <p>Voor gedetailleerde informatie over het gebruik van deze website verwijzen we u naar
        de gebruikershandleiding. De handleiding vindt u op
        de <a href="https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/"
              target="_blank" rel="nofollow noopener">LIWO pagina van de helpdesk water</a>.
      </p>
      <h2 data-class="section-head">Auteursrecht</h2>
      <p>
        Het auteursrecht op de LIWO-website is uitdrukkelijk
        voorbehouden en berust bij het Watermanagementcentrum
        Nederland (WMCN). Onder voorwaarde dat de bron (LIWO,
        Watermanagementcentrum Nederland) wordt vermeld, mogen
        onderdelen van de inhoud van de website worden
        overgenomen.
      </p>
      <h2 data-class="section-head">Privacy</h2>
      <p>
        Uw persoonsgegevens worden conform de Wet Bescherming
        Persoonsgegevens
        behandeld.
      </p>
      <h2 data-class="section-head">Vernieuwing LIWO</h2>
      <p>
        Er wordt veel zorg besteed aan het zo compleet, correct, actueel en toegankelijk mogelijk aanbieden van de informatie in LIWO. Wij streven ernaar LIWO zo volledig en gebruikersvriendelijk mogelijk te houden. LIWO wordt steeds verder ontwikkeld en periodiek volgt er een nieuwe release.
      </p>
      <div class="panel soft" >
        <p>Applicatie versie: {{ version }}</p>
        <p>User interface versie: {{ uiVersion }}</p>
        <p>Backend versie: {{ backendVersion }}</p>
        <p>Dataset versie: {{ datasetVersion }}</p>
      </div>
      <p>De broncode van deze software staat op <a href="https://github.com/deltares/liwo-static">github/deltares/liwo-static</a></p>

    </section>
  </div>
</div>
</template>

<script>
import mapConfig from '../map.config'

export default {
  name: 'About',
  data () {
    return {
      /* main version */
      version: 'not set',
      uiVersion: process.env.VUE_APP_VERSION,
      datasetVersion: 'not set',
      backendVersion: 'not set'

    }
  },
  async mounted () {
    const services = await mapConfig.getServices()
    this.version = services.VERSION
    this.datasetVersion = services.DATASET_VERSION
    this.backendVersion = services.BACKEND_VERSION
  }
}

</script>
