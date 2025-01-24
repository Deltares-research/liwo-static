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
        Voor meer achtergrondinformatie en het laatste nieuws over LIWO kijkt u
        op de website
        <a
          href="https://iplo.nl/thema/water/applicaties-modellen/berichtgeving-crisismanagement/liwo/"
          target="_blank"
          rel="nofollow noopener"
        >
          Informatiepunt Leefomgeving (iplo.nl)</a
        >. Gebruik de
        <router-link
          :to="{ name: 'maps' }"
          @click="useStartTour().start()"
          >interactieve tour</router-link
        >
        voor een uitleg over het gebruik van LIWO.
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
import { useStartTour } from '@/tour/use-start-tour'

export default {
  name: 'AboutPage',
  data () {
    return {
      version: 'not set'
    }
  },
  async mounted () {
    const services = await mapConfig.getServices()
    this.version = services.VERSION
  },
  methods: {
    useStartTour
  }
}

</script>
