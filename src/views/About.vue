<template>
  <div class="about site-main">
    <div>
      <section class="section">
        <h2 data-class="section-head">Tips voor sitebezoek</h2>
        <p>
          De informatie op deze website is ondergebracht in 'Kaarten'
          en 'Gereedschappen'.
        </p>
        <p>Het kopje 'Kaarten' is voor iedereen
      toegankelijk en bevat kaartlagen voor professionals van
      veiligheidsregio's, waterschappen en Rijkwaterstaat, die nodig
      zijn voor de voorbereiding op watercrises en overstromingen in
      Nederland. Het gaat hierbij om crisisbeheersing maar het is ook
      bruikbaar voor ruimtelijke adaptatie en versterking van
      zelfredzaamheid.</p><p>Het kopje 'Gereedschappen' is
      toegankelijk na inloggen met uw gebruikersaccount. Met de
      gereedschappen kunt u als beheerder inzicht geven in de
      status/beoordeling van uw areaal.</p><p>U kunt een account
      aanvragen als u behoort tot de doelgroep van LIWO. Kies hiervoor
      'Inloggen' en klik op 'Aanvragen'.</p><p>Voor gedetailleerde
      informatie over het gebruik van deze website verwijzen we u naar
      de gebruikershandleiding. De handleiding vindt u op
      de <a href="https://www.helpdeskwater.nl/onderwerpen/applicaties-modellen/applicaties-per/watermanagement/watermanagement/liwo/"
      target="_blank" rel="nofollow noopener">LIWO pagina van de helpdesk water</a>.
        </p>
        <h2 data-class="section-head">Techniek</h2>
        <p>
          De LIWO-website is ontworpen voor de schermgrootte
      1920x1080 en is te bekijken met vrijwel alle browsers. Door
      responsive technieken is de site ook op kleinere schermen prima
      leesbaar. Tekstbestanden worden op de site in PDF-formaat
      aangeboden. PDF staat voor Portable Document Format, een
      bestandstype dat u kunt lezen en afdrukken als Adobe Acrobat
      Reader op uw computer is geïnstalleerd. Dit programma is voor
      vrijwel alle computerplatforms geschikt en u kunt het gratis
      downloaden op de site van
          Adobe.
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
        <h2 data-class="section-head">Vernieuwing site</h2>
        <p>
          Er
          wordt veel zorg besteed aan het zo compleet, correct,
          actueel en toegankelijk mogelijk aanbieden van de informatie
          op deze site. Wij streven ernaar de site zo volledig en
          gebruikersvriendelijk mogelijk te houden. De site wordt
          steeds verder ontwikkeld en periodiek volgt er een nieuwe
          release.
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
  },
}
</script>
