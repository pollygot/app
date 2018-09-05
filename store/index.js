import Axios from 'axios'
import config from '../config/default'
export const state = () => ({
  
})

export const actions = {
  async nuxtServerInit({ commit }, { app, req }) {

    console.log('app', req)
    if (process.env.POSTGREST_URL) {
      let swagger = await this.$axios.$get('pg')
      commit('resources/setSwagger', swagger)
    }
  }
}