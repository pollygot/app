<template>
  <div class="Apps">
    <section class="section" >
      <div class="columns is-centered">
        <div class="column is-4 m-l-lg m-r-lg">
          <h4 class="title is-4">{{tenant.name}}</h4>
          <nuxt-link class="" tag="a"  v-for="app in tenant.apps" :key="app.id" :to="`/${app.appKey.toLowerCase()}/${app.id}`">
            <div class="box m-b-md">
              <h5 class="title is-6">{{app.name}}</h5>
              <p>{{appDescription(app.appKey)}}</p>
            </div>
          </nuxt-link>
        </div>
        <!-- <div class="column m-l-lg m-r-lg">
          <h4 class="title is-4">Add new app</h4>
          <nuxt-link class="" tag="a"  v-for="app in allPollygotApps" :key="app.id" :to="`/`">
            <div class="box m-b-md">
              <h5 class="title is-6">{{app.name}}</h5>
              <p>{{app.description}}</p>
            </div>
          </nuxt-link>
        </div> -->
      </div>

    </section>
  </div>
</template>

<script>
export default {
  layout: 'tenant',
  computed: {
    allPollygotApps () {
      return this.$store.getters['apps']
    },
    tenant () {
      return this.$store.getters['tenants'].find(x => (x.key.toString() == this.$route.params.tenant.toString()))
    }
  },
  methods: {
    appName (appId) {
      return this.allPollygotApps[`${appId}`].name
    },
    appDescription (appId) {
      return this.allPollygotApps[`${appId}`].description
    }
  }
}
</script>

<style lang="scss">
.Apps {
  .fixed-col {
    min-width: 200px;
    max-width: 200px;
    min-height: 200px;
    max-height: 200px;
    display: flex;
    align-items: stretch;
    .box {
      flex: 2;
    }
  }
}
</style>
