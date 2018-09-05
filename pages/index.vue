<template>
  <div class="Apps">
    <section class="section" v-for="tenant in tenants" :key="tenant.id">


        <h4 class="title is-4">{{tenant.name}}</h4>
        <div class="columns is-multiline is-mobile">
          <nuxt-link class="fixed-col column" tag="a"  v-for="app in tenant.apps" :key="app.id" :to="`/${app.appKey.toLowerCase()}/${app.id}`">
            <div class="box has-text-centered">
              <h5 class="title is-6">{{app.name}}</h5>
              <p>{{appDescription(app.appKey)}}</p>
            </div>
          </nuxt-link>
        </div>

    </section>
  </div>
</template>

<script>
export default {
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

<style lang="scss">
.Apps {
  .fixed-col {
    min-width: 200px;
    max-width: 200px;
    min-height: 150px;
    max-height: 150px;
    display: flex;
    align-items: stretch;
    .box {
      flex: 2;
    }
  }
}
</style>
