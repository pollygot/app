import axios from 'axios'
export default async function({ params, store }) {
  let { appId } = params
  let app = store.getters['app'](appId)
  let baseUrl = app.config.url
  store.commit('pidgeon/setBaseUrl', baseUrl)
  let { data } = await axios.get(baseUrl)
  store.commit('pidgeon/setSwagger', data)
}
