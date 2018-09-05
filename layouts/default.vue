<template>
  <div class="columns is-gapless">
    <div class="column is-narrow is-hidden-mobile" v-show="sidebarVisible">
      <div class="sidebar">


        <nav class="navbar has-text-centered">
          <nuxt-link tag="a" class="navbar-item" :to="'/'">
            <span class="icon is-large">Restiface</span>
          </nuxt-link>
        </nav>

        <!-- Enabled only if using Pollygot Core (need to save the views to a database)
          <aside class="menu">
          <p class="menu-label">Team views</p>
          <ul class="menu-list">
            <li v-for="(link, i) in menuLinks" :key="i">
              <nuxt-link tag="a" :to="`/${link.type}/${link.resource}?q=${link.query}`">
                {{link.label}}
              </nuxt-link>
            </li>
          </ul>
        </aside>
         -->
        <aside class="menu" v-show="tables.length">
          <p class="menu-label">Tables</p>
          <ul class="menu-list">
            <li v-for="(link, i) in tables" :key="i">
              <nuxt-link tag="a" :to="`/${link.type}/${link.resource}`" :class="{ 'is-active': link.isActive }">
                {{link.label}}
              </nuxt-link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
    <div class="column" id="content">
      <nav class="custom-nav">
        <div class="navbar-brand">
          <a class="navbar-item" @click="toggleSidebar()">
            <span class="icon is-large"><i class="fas fa-bars"></i></span>
          </a>
        </div>

        <div class="navbar-item navbar-title">
          <span>

          </span>
        </div>
        <a class="navbar-item">
            <span class="icon is-large"><i class="far fa-bell"></i></span>
          </a>
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
      return this.$store.getters['resources/tables'].map(x => ({
        type: 'list',
        resource: x.key,
        label: x.key.replace(/_/g, ' '),
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
.columns {
  height: 100vh;
}
.sidebar {
  height: 100vh;
  width: 260px;
  transition: all 0.3s;
  overflow: auto;
  overflow-x: hidden;
  .navbar {
    border-bottom: 1px solid $light-grey;
    width: 100%;
    .navbar-item {
      margin-left: auto;
      margin-right: auto;
      &:hover {
        background: none;
      }
    }
  }
  .menu {
    p { // headers
      padding: 20px 20px 0 20px;
    }
    a { //links
      padding: 12px 20px;
      margin: 2px 0;
      text-transform: uppercase;
      font-size: 0.9rem;
      border-radius: 0;
      &.is-active, &:hover {
        background: rgba( $blue, 0.05 );
        border-right: 2px solid $primary;
        color: #000;
      }
    }
  }
}
.custom-nav {
  background-color: white;
  position: relative;
  z-index: 30;
  min-height: 3.25rem;
  align-items: stretch;
  display: flex;
  border-bottom: 1px solid $light-grey;

  .navbar-brand {
    align-items: stretch;
    display: flex;
    flex-shrink: 0;
    min-height: 3.25rem;
  }

  .navbar-item {
    display: flex;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    color: #4a4a4a;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
    position: relative;

    &.navbar-title {
      flex-grow: 1;
      text-align: center;
      font-weight: bold;
      justify-content: center;
    }
  }
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
