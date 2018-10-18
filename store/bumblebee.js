export const state = () => ({
  apps: {},
})

export const mutations = {
  setApps(state, apps) {
    state.apps = apps
  },
}

export const getters = {
  apps: state => state.apps,
}
