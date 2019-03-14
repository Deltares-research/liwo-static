import Vue from 'vue'

import App from './App.vue'
import leafletDirective from './lib/leaflet-directive'
import router from './router'
import store from './store'
require('@babel/polyfill')
require('unfetch/polyfill')

Vue.config.productionTip = false
Vue.directive('leaflet', leafletDirective)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
