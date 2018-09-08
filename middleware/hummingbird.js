import axios from 'axios'
export default function ({params, store}) {
  let { appId } = params
  let app = store.getters['app'](appId)
  return axios.get(app.config.url).then((res) => {
    store.commit('hummingbird/setSwagger', res.data)
  })
}
