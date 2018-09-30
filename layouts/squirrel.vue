<template>
  <div class="columns is-gapless full-height">
    <div class="column" id="content">
      <nav class="navbar ">
        <nuxt-link tag="a" class="navbar-item" :to="'/'">
          Home
        </nuxt-link>
      </nav>
      <nuxt/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sidebarVisible: true,
    }
  },
  computed: {
    // Get all database tables from the swagger definition and format them for the sidebar menu
    tables () {
      return this.$store.getters['hummingbird/tables'].map(x => ({
        type: 'list',
        resource: x.key,
        label: x.label,
        isActive: (x.key === this.$route.params.resourceKey)
      }))
    }
  },
  methods: {
    toggleSidebar () {
      this.sidebarVisible = !this.sidebarVisible
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/vars.scss';
html, body {
  overflow: hidden;
}
.columns.full-height {
  height: 100vh;
}
#content {
  background: #F5F6FA;
  border-left: 1px solid $light-grey;
  box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  .navbar {
    border-bottom: 1px solid $light-grey;
  }
}
</style>
