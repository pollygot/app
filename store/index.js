import axios from 'axios'
import config from '../config/default'
export const state = () => ({
  apps: config.apps || [],
  tenants: config.tenants || [] // all the tenants for this user, which should include the apps for each tenant
})

export const actions = {
  async nuxtServerInit({ commit }, { app, req, route }) {
    const path = route.path.toLowerCase()
    const { appId } = route.params
    let currentApp = null
    
    if (path.indexOf('/hummingbird') === 0) currentApp = config.apps.HUMMINGBIRD.key
    else if (path.indexOf('/penguin') === 0) currentApp = config.apps.PENGUIN.key
    
    if (appId && currentApp) {
      let userAvailableApps = config.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), [])
      let currentAppInstance = userAvailableApps.find(x => (x.id.toString() === appId))
      let appConfig = currentAppInstance.config 
      
      // if (currentApp === config.apps.HUMMINGBIRD.key) {
      //   let { data: swagger } = await axios.get(appConfig.url)
      //   console.log('called')
      //   commit('hummingbird/setSwagger', swagger)
      // }
    }
  }
}

export const getters = {
  app: state => appId => state.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), []).find(x => (x.id.toString() === appId.toString())),
  apps: state => state.apps,
  tenants: state => state.tenants,
  userApps: state => state.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), [])
}
