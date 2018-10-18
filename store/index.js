import axios from 'axios'
import config from '../config/default'
import constants from '../lib/common/constants'

const INITIAL_STATE = {
  apps: constants.apps, // all the Pollygot Apps that are available on Pollygot
  isLoggedIn: false,
  tenants: config.tenants || [], // all the tenants for this user, which should include the apps for each tenant
  user: {}, // logged in user (if they are logged in)
}

/**
 * Initial state
 */
export const state = () => ({ ...INITIAL_STATE })

/**
 * Actions
 */
export const actions = {
  async nuxtServerInit({ commit }, { app, req, route }) {
    const path = route.path.toLowerCase()
    const { appId } = route.params
  },
}

/**
 * Mutations
 */
export const mutations = {
  logout(state) {
    // clear cookies
    state = { ...INITIAL_STATE }
  },
}

/**
 * Getters
 */
export const getters = {
  app: state => appId =>
    state.tenants
      .reduce((acc, tenant) => acc.concat(tenant.apps), [])
      .find(x => x.id.toString() === appId.toString()),
  apps: state => state.apps,
  tenants: state => state.tenants,

  // all apps for this user (in all tenants)
  userApps: state =>
    state.tenants.reduce((acc, tenant) => acc.concat(tenant.apps), []),
}
