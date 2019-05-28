<template>
  <div class="site-outer-wrapper">
    <div class="site-container" id="app">
      <app-header :page-title="title" />
      <div id="content" role="main">
        <!-- main content goes here, based on router view -->
        <router-view />
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
import { mapGetters } from 'vuex'

import AppHeader from '../src/components/AppHeader.vue'

export default {
  computed: {
    ...mapGetters([
      'layerSet'
    ]),
    title () {
      if (this.layerSet) {
        return this.layerSet.title
      }
      return this.$route.meta.title
    }
  },
  components: {
    AppHeader
  }
}
</script>

<style lang="scss">
  @import './styles/rws.css';
  @import './styles/rws-embedded.css';
  @import './styles/liwo.css';

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  ul,
  ul > li {
    margin: 0;
    padding: 0;
  }

  ul > li::before {
    content: none;
    float: none;
    margin-left: 0;
  }

  .icon {
    vertical-align: middle;
  }

  .site-footer__content {
    padding: 0.5em 0.5em;
  }
</style>
