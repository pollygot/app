<template>
  <div>
    <section class="section">

      <div class="box has-text-centered">
        <h5 class="title is-6">Hummingbird</h5>
        <p>App</p>
      </div>

    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config/default'
export default {
  layout: ['hummingbird'],
  fetch ({ store, params }) {
    let { appId } = params
    let app = store.getters['app'](appId)
    return axios.get(app.config.url).then((res) => {
      store.commit('hummingbird/setSwagger', res.data)
    })
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>

</style>
