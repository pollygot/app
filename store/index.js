import axios from 'axios'
import config from '../config/default'
import constants from '../lib/common/constants'
export const state = () => ({
  apps: constants.apps, // all the Pollygot Apps that are available on Pollygot
  tenants: config.tenants || [] // all the tenants for this user, which should include the apps for each tenant
})

export const actions = {
  async nuxtServerInit({ commit }, { app, req, route }) {
    const path = route.path.toLowerCase()
    const { appId } = route.params
  }
}

export const getters = {
  app: state => appId => state.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), []).find(x => (x.id.toString() === appId.toString())),
  apps: state => state.apps,
  tenants: state => state.tenants,

  // all apps for this user (in all tenants)
  userApps: state => state.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), []) 
}
