import Vue from 'vue'

import App from './App.vue'
import leafletDirective from './lib/leaflet-directive'
import VueSkipTo from '@vue-a11y/skip-to'
import router from './router'
import store from './store'
import VueHead from 'vue-head'

import '@babel/polyfill'
import 'whatwg-fetch'
import 'url-polyfill'
import 'proxy-polyfill'

Vue.config.productionTip = false
Vue.directive('leaflet', leafletDirective)
Vue.use(VueHead)
Vue.use(VueSkipTo)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
