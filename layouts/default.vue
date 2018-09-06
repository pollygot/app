<template>
  <div class="columns is-gapless full-height">
    <div class="sidebar column is-narrow is-hidden-mobile" v-show="sidebarVisible">

        <nav class="navbar has-text-centered">
          <div class="navbar-brand">
            <nuxt-link tag="a" class="pollygot-logo navbar-item" :to="'/'">
                <img src="/img/pollygot-logo.svg" alt="Pollygot"  />
            </nuxt-link>
          </div>
        </nav>

        <aside class="menu">
          <p class="menu-label">Teams</p>
          <ul class="menu-list">
            <li>
              <nuxt-link tag="a" :to="`/`" class="">
                Nimbus For Work
              </nuxt-link>
            </li>
            <li>
              <nuxt-link tag="a" :to="`/`" class="">
                BlockPunk
              </nuxt-link>
            </li>
            <li>
              <nuxt-link tag="a" :to="`/`" class="has-icon">
                <span class="icon"><i class="fas fa-plus"></i></span>
                New
              </nuxt-link>
            </li>
          </ul>
          <p class="menu-label">Account</p>
          <ul class="menu-list">
            <li>
              <nuxt-link tag="a" :to="`/`" class="has-icon">
                <span class="icon"><i class="fas fa-user"></i></span>
                Profile
              </nuxt-link>
            </li>
            <li>
              <nuxt-link tag="a" :to="`/`" class="has-icon">
                <span class="icon"><i class="fas fa-gift"></i></span>
                Invites
              </nuxt-link>
            </li>
            <li>
              <nuxt-link tag="a" :to="`/`" class="has-icon">
                <span class="icon"><i class="fas fa-cog"></i></span>
                Settings 
              </nuxt-link>
            </li>
          </ul>
        </aside>

    </div>
    <div class="column" id="content">
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
