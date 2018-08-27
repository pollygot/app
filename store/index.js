import Axios from 'axios'
export const state = () => ({
  
})

export const actions = {
  async nuxtServerInit({ commit }, { app, req }) {
    if (process.env.POSTGREST_URL) {
      let swagger = await this.$axios.$get('pg')
      commit('resources/setSwagger', swagger)
    }
  }
}