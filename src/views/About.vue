<template>
  <div class="about site-main">
    <section class="section">
      <p>
        Dit informatiesysteem bevat kaartlagen voor professionals, die nodig
        zijn voor de voorbereiding op wateroverlast en overstromingen in Nederland.
        Deze ruimtelijke informatie is voor iedereen toegankelijk. Het gaat hierbij
        om crisisbeheersing (preparatie en respons) maar het is ook bruikbaar
        voor ruimtelijke adaptatie. Kaarten worden vanuit het LIWO ook
        beschikbaar gesteld aan andere systemen voor het verhogen van het
        waterbewustzijn en de versterking van zelfredzaamheid.
      </p>
      <h2 data-class="section-head">Bron</h2>
      <p>
        De overstromingsinformatie is afkomstig uit de Landelijke Database
        Overstromingsinformatie waarin bronhouders zoals Provincies,
        Waterschappen en Rijkswaterstaat, informatie beschikbaar hebben gesteld
        voor landelijk gebruik.
      </p>
      <h2 data-class="section-head">Tips voor sitebezoek</h2>
      <p>
        Voor gedetailleerde informatie over het gebruik van deze website verwijzen
        we u naar de gebruikershandleiding. De handleiding vindt u op de
        <a href="https://iplo.nl/thema/water/applicaties-modellen/berichtgeving-crisismanagement/liwo/" target="_blank" rel="nofollow noopener">website Informatiepunt Leefomgeving (iplo.nl)</a>.
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
        Er wordt veel zorg besteed aan het zo compleet, correct,
        actueel en toegankelijk mogelijk aanbieden van de informatie
        in LIWO. Wij streven ernaar LIWO zo volledig en gebruikersvriendelijk
        mogelijk te houden. LIWO wordt steeds verder ontwikkeld en
        periodiek volgt er een nieuwe release.
      </p>
      <div class="panel soft" >
        <p>Applicatie versie: {{ version }}</p>
      </div>
      <p>De broncode van deze software staat op <a href="https://github.com/deltares/liwo-static">github/deltares/liwo-static</a></p>
    </section>
  </div>
</template>

<script>
import mapConfig from '../map.config'

export default {
  name: 'AboutView',
  data () {
    return {
      version: 'not set'
    }
  },
  async mounted () {
    const services = await mapConfig.getServices()
    this.version = services.VERSION
  }
}

</script>
