// Populates the store with the current user's apps and config.
// Useful for the sidebar
export default async function({ app, params, store }) {
  let { appId } = params
  let { data: response } = await app.$axios.get(`/api/postgrest/${appId}/`)
  store.commit('hummingbird/setSwagger', response.data)
}
