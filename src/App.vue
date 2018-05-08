<template>
  <div class="site-outer-wrapper">
    <div class="site-container" id="app">
      <app-header />
      <!-- main content goes here, based on router view -->
      <div id="content" role="main">
        <!-- main content goes here, based on router view -->
        <router-view/>
      </div>

      <footer class="site-footer noindex">
        <img src="https://staticresources.rijkswaterstaat.nl/assets/img/footer-logo.png?v=2.19.2" width="500" height="24" alt="Rijkswaterstaat Ministerie van Infrastructuur en Waterstaat. Water. Wegen. Werken." class="accessibility">
        <div class="site-footer__content">
          <!-- nothing here for now -->
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import AppHeader from '../src/components/AppHeader.vue'

export default {
  components: {
    AppHeader
  }
}
</script>

<style lang="scss">
@import './styles/rws.css';
@import './styles/rws-embedded.css';
@import './styles/liwo.css';

</style>
