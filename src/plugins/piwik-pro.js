import VuePiwikPro, { UserManagement } from '@piwikpro/vue-piwik-pro'
import mapConfig from '../map.config'

const install = async () => {
  const services = await mapConfig.getServices()
  VuePiwikPro.initialize(
    services.PIWIK_CONTAINER_ID,
    services.PIWIK_CONTAINER_URL
  )
  UserManagement.setUserIsAnonymous(true)
}

export default install;
