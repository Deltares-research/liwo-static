
import { createApp } from "vue";

import App from './App.vue'
import VueSkipTo from '@vue-a11y/skip-to'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue'

// Plugin loads the matomo settings, available under $matomo
import installMatamo from './plugins/vue-matomo.js'

// // Directives
import installLeafletDirective from './lib/leaflet-directive'
import installTestDirective from './directives/test.js'

const app = createApp(App)
app.use(VueSkipTo)
app.use(router)
app.use(store)
app.use(PortalVue)
installMatamo(app) // TODO this is not consistent with the rest
installTestDirective(app)
installLeafletDirective(app)

app.mount('#app')
