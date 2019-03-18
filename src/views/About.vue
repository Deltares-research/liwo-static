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
        <div class="panel soft" title="$LastChangedDate: 2018-02-06 16:06:41 +0100 (Tue, 06 Feb 2018) $ $Rev: 2250 $">versie: 1.1.1</div>
      </section>
    </div>
  </div>
</template>

<script>
const PAGE_TITLE = 'Over LIWO'

export default {
  name: 'about',
  mounted () {
    this.$store.commit('setPageTitle', PAGE_TITLE)
  }
}
</script>
