import { createApp } from "vue";
import VuePiwikPro from '@piwikpro/vue-piwik-pro'

import App from './App.vue'
import VueSkipTo from '@vue-a11y/skip-to'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue'


// Directives
import installTestDirective from './directives/test.js'
import installClickOutsideDirective from './directives/click-outside.js'

VuePiwikPro.initialize(
  import.meta.env.VITE_PIWIK_PRO_CONTAINER_ID,
  import.meta.env.VITE_PIWIK_PRO_CONTAINER_URL
)

const app = createApp(App)
app.use(VueSkipTo)
app.use(router)
app.use(store)
app.use(PortalVue)
installTestDirective(app)
installClickOutsideDirective(app)

app.mount('#app')
