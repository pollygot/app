export default async function ({app, params, store}) {
  let { appId } = params
  let { data:response } = await app.$axios.get(`/api/postgrest/${appId}/`)
  store.commit('hummingbird/setSwagger', response.data)
}
