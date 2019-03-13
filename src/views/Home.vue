<template>
  <div class="home site-landing">
    <div class="landing">

      <div class="landing-cover compact"></div>
      <div class="landing-title">
        <h1>LIWO</h1>
      </div>
      <div class="landing-header">
        <p class="lead">
          Het Landelijk Informatiesysteem Water en Overstromingen (LIWO) bevat kaartlagen voor professionals die zich
          bezighouden met (de voorbereiding op) wateroverlast en overstromingen in Nederland. Het LIWO is een product
          van het Watermanagementcentrum Nederland (WMCN).
        </p>
      </div>
      <section class="landing-body section" role="main">
        <h3>Gebruik</h3>

        <p>
          Het juist duiden van beschikbare kaartlagen vereist specialistische kennis. Deze kennis is beschikbaar bij
          waterbeheerders. Het wordt daarom aanbevolen om deze kennis te betrekken, zowel bij ruimtelijke adaptatie als bij
          wateroverlast en (de voorbereiding op) overstromingen.
        </p>
        <p>Voor niet-professionele gebruikers is er <a href="https://www.overstroomik.nl">www.overstroomik.nl</a>.</p>
        <p>
          Voor uitleg over het gebruik en de gebruikershandleiding kunt u terecht op de Helpdesk Water. Hier vindt u ook
          contactgegevens voor het aanvragen van LIWO-opleidingen.
        </p>

        <p>
          Het juist vertalen van beschikbare kaartlagen naar
          bruikbare informatie voor de voorbereiding op
          overstromingen vereist specialistische kennis. Deze kennis
          is beschikbaar bij waterbeheerders. Het wordt daarom
          aanbevolen om deze kennis te betrekken, zowel bij
          ruimtelijke adaptatie en de voorbereiding op
          overstromingen als in hoogwatersituaties.
        </p>
        <h3>Account aanvragen</h3>
        <p>
          Als u tot de doelgroep behoort en een account wilt
          aanvragen, selecteer dan "Nieuw account aanvragen"
          onder <a href="https://www.basisinformatie-overstromingen.nl/liwo/#/login">Inloggen</a>.
        </p>
        <h3>Wat voor kaartlagen bevat het LIWO?</h3>
        <p>
          De basis van het LIWO wordt gevormd door generieke
          kaartlagen (zoals administratieve en geografische
          indelingen, topografie etc.) en
          overstromingssimulaties. Vrijwel alle kaartlagen zijn
          afkomstig van externe bronnen, waarbij het LIWO zorgt
          voor het bundelen en beschikbaar stellen van de
          beschikbare kennis. De externe bron blijft aanspreekbaar
          voor de kwaliteit en de actualiteit van de weergegeven
          informatie.  Het LIWO bevat bijvoorbeeld de set
          scenario's die in het Deltaprogramma zijn gebruikt bij
          het afleiden van de nieuwe waterveiligheidsnormen
          (waaronder de volledige set afkomstig van het landelijke
          project Veiligheid Nederland in Kaart).
        </p>
        <p>
          Ook bevat het LIWO specifieke gedeelde kaartlagen die de
          waterbeheerders (waterschappen en Rijkswaterstaat)
          kunnen aanvullen om met elkaar een actueel overzicht te
          houden van de belangrijke gebeurtenissen die de
          waterveiligheid kunnen beïnvloeden. Deze kaartlagen
          kunnen eenvoudig worden gedeeld met netwerkpartners in
          de crisis- en rampenbeheersing. Het beoogde gebruik als
          crisiscommunicatiesysteem betekent dat het LIWO voldoet
          aan de hoge beschikbaarheidseisen die aan zulke systemen
          kunnen worden gesteld.
        </p>
        <h3>Kan ik de LIWO-kennis ook gebruiken in mijn eigen systeem?</h3>
        <p>
          Het LIWO hanteert open data standaarden voor het delen
          van de informatie met andere LIWO-gebruikers en met elke
          willekeurige applicatie van derden. Uiteraard is
          specifieke operationele informatie beveiligd volgens de
          eisen die het Rijk hieraan stelt. Alle kaartlagen in het
          LIWO kunnen vanuit de geo-server rechtstreeks gedeeld
          worden met systemen van derden, zoals bijvoorbeeld met
          het Landelijk Crisis Management Systeem (LCMS) en
          webapplicaties zoals Overstroomik.nl. U kunt de
          handleiding voor toegang tot de geo-server opvragen bij
          functioneel beheer LIWO.
        </p>
        <h3>Is LIWO een rekenmodel?</h3>
        <p>
          Het LIWO is geen rekenmodel. In het landschap van
          systemen en kennis m.b.t.  overstromingen valt er
          onderscheid te maken
          tussen:</p>
        <ol>
          <li>Model-/rekeninstrumentaria</li>
          <li>Gedeelde databases</li>
          <li>Viewers</li>
          <li>Crisiscommunicatiesystemen</li>
          <li>Risicocommunicatietool</li>
        </ol>
        <h3>Kennis leverende projecten </h3>
        <p>
          Het LIWO is een gedeelde database (2), een viewer (3) en
          een crisiscommunicatiesysteem (4). Het LIWO bevat
          informatie die onder andere is gemaakt met
          model-/rekeninstrumentaria (1) afkomstig van diverse
          kennisleverende projecten.  Het LIWO levert informatie
          aan diverse risicocommunicatietools (5).</p>
        <h3>Kan ik zelf aan de slag met het LIWO?</h3>
        <p>
          Daar is het LIWO voor bedoeld. In algemene zin is het
          voor eenieder die zich niet als waterexpert beschouwt
          aan te bevelen om voor het toepassen van dit type kennis
          een expert van het desbetreffende waterschap of
          Rijkswaterstaat te betrekken. Daarbij kan het voor de
          gebruiker van belang zijn om zoveel mogelijk aan te
          sluiten bij informatie die voor Nederland eenduidig en
          uniform is vervaardigd, zoals de resultaten van het
          project Veiligheid Nederland in Kaart en het
          Deltaprogramma; Deze zijn beschikbaar in het LIWO. Voor
          enkele specifieke toepassingen kan het raadzaam zijn om
          een ander type informatie te gebruiken.  Bespreek de
          mogelijkheden met het
          waterschap.
        </p>
      </section>
    </div>
  </div>
</template>
<script>
const PAGE_TITLE = 'LIWO – Landelijk Informatiesysteem Water en Overstromingen'

export default {
  name: 'home',
  mounted () {
    this.$store.commit('setPageTitle', PAGE_TITLE)
  }
}
</script>
<style>
  .landing-cover {
  background-image: url("../img/Rhenen 3 hoogwater 1600-400.jpg");
  /* we're in the content now, move back up a bit */
  }
  /* float in the center */
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
</style>
