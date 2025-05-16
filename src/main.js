import { createApp } from "vue";

import piwikPro from './plugins/piwik-pro.js'

import App from './App.vue'
import VueSkipTo from '@vue-a11y/skip-to'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue'

// Directives
import installTestDirective from './directives/test.js'
import installClickOutsideDirective from './directives/click-outside.js'

piwikPro()
const app = createApp(App)
app.use(VueSkipTo)
app.use(router)
app.use(store)
app.use(PortalVue)
installTestDirective(app)
installClickOutsideDirective(app)

app.mount('#app')
