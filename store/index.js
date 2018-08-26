export const state = () => ({
  
})

export const actions = {
  async nuxtServerInit({ commit }, { app, req }) {
    // if (!req.session.user) return; // @TODO: Auth and user logins

    if (process.env.POSTGREST_URL) {
      let swagger = await this.$axios.$get(process.env.POSTGREST_URL)
      commit('resources/setSwagger', swagger)
    }
  }
}