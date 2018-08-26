<template>
  <div class="columns is-gapless">
    <div class="column is-narrow is-hidden-mobile">
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
              <nuxt-link tag="a" :to="`/${link.type}/${link.resource}`">
                {{link.label}}
              </nuxt-link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
    <div class="column" id="content">
      <nuxt/>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // Get all database tables from the swagger definition and format them for the sidebar menu
    tables () {
      return this.$store.getters['resources/tables'].map(x => ({
        type: 'list',
        resource: x.key,
        label: x.key.replace(/_/g, ' ')
      }))
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/vars.scss';
.columns {
  height: 100vh;
}
.sidebar {
  height: 100vh;
  width: 260px;
  transition: all 0.3s;
  overflow: scroll;
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
      padding: 15px 20px;
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
#content {
  background: #F5F6FA;
  border-left: 1px solid $light-grey;
  box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  .navbar {
    border-bottom: 1px solid $light-grey;
  }
}
</style>

