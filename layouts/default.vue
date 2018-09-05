<template>
  <div class="columns is-gapless full-height">
    <div class="column is-narrow is-hidden-mobile" v-show="sidebarVisible">
      <div class="sidebar">

        <nav class="navbar has-text-centered">
          <nuxt-link tag="a" class="navbar-item" :to="'/'">
            <span class="icon is-large">Pollygot</span>
          </nuxt-link>
        </nav>

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
