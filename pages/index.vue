<template>
  <div class="Apps">
    <section class="section">
      <h3 class="title is-3 has-text-centered m-b-xl">Teams</h3>
      <div class="columns is-centered is-multiline">
        <nuxt-link tag="a" class="column is-7 box"  v-for="tenant in tenants" :key="tenant.id" :to="`/${tenant.key}`">
          <h5 class="title is-5">{{tenant.name}}</h5>
        </nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    apps() {
      return this.$store.getters['apps']
    },
    tenants() {
      return this.$store.getters['tenants']
    },
  },
  methods: {
    appName(appId) {
      return this.apps[`${appId}`].name
    },
    appDescription(appId) {
      return this.apps[`${appId}`].description
    },
  },
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
