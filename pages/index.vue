<template>
  <div>
    <section class="section" v-for="tenant in tenants" :key="tenant.id">


        <h4 class="title is-4">{{tenant.name}}</h4>
        <div class="columns">
          <div class="column" v-for="app in tenant.apps" :key="app.id">
            <nuxt-link tag="a" :to="`/${app.appKey.toLowerCase()}/${app.id}`">
              <div class="box has-text-centered">
                <h5 class="title is-6">{{app.name}}</h5>
                <p>{{appDescription(app.appKey)}}</p>
              </div>
            </nuxt-link>
          </div>
        </div>

    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    apps () {
      return this.$store.getters['apps']
    },
    tenants () {
      return this.$store.getters['tenants']
    }
  },
  methods: {
    appName (appId) {
      return this.apps[`${appId}`].name
    },
    appDescription (appId) {
      return this.apps[`${appId}`].description
    }
  }
}
</script>

<style>

</style>
