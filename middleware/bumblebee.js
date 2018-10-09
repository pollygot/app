
export default async function ({app, params, store}) {
  let { appId } = params
  let { data: apps } = await app.$axios.get(`/api/bumblebee/${appId}/apps/`)
  store.commit('bumblebee/setApps', apps)
}
