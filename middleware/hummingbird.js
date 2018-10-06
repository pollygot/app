
export default async function ({app, params, store}) {
  let { appId } = params
  let { data:appSwagger } = await app.$axios.get(`/api/postgrest/${appId}/`)
  let { data:views } = await app.$axios.get(`/api/pollygot/app/${appId}/views`)
  store.commit('hummingbird/setSwagger', appSwagger.data)
  store.commit('hummingbird/setCustomViews', views)
}
