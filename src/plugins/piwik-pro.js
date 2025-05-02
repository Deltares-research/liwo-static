
import VuePiwikPro, { UserManagement } from '@piwikpro/vue-piwik-pro'

const install = () => {
  VuePiwikPro.initialize(
    import.meta.env.VITE_PIWIK_PRO_CONTAINER_ID,
    import.meta.env.VITE_PIWIK_PRO_CONTAINER_URL
  )
  UserManagement.setUserIsAnonymous(true)
}

export default install;