<template>
<div class="Sidebar sidebar column is-narrow is-hidden-mobile" v-show="sidebarVisible" ref="sidebar">

  <nav class="navbar has-text-centered" v-if="!currentTenant">
    <div class="navbar-brand">
      <nuxt-link tag="a" class="pollygot-logo navbar-item" :to="'/'">
          <img src="/img/pollygot-logo.svg" alt="Pollygot"  />
      </nuxt-link>
    </div>

    
  </nav>
  <div v-if="currentTenant">

      <div class="tenant-dropdown dropdown" :class="{ 'is-active': dropdownActive}" @click="dropdownActive = !dropdownActive"  v-click-outside="() => {this.dropdownActive = false}" >
          <div class="dropdown-trigger is-fullwidth">
            <a class="" >
              <div class="is-size-4 title m-b-sm">{{currentTenant.name}}
                <span class="icon is-small is-size-7"><i class="fas fa-angle-down"></i></span>
              </div>
              <div v-if="currentApp">{{currentApp.name}}</div>
            </a>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <div class="dropdown-item media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-5">{{currentTenant.name}}</p>
                  <p class="subtitle is-7 has-text-grey-light"></p>
                </div>
              </div>
              <p class="heading is-size-7 dropdown-item has-text-grey-light m-b-none">Apps</p>
              <nuxt-link tag="a" class="dropdown-item" :to="`/${app.appKey.toLowerCase()}/${app.id}`" v-for="app in currentTenant.apps" :key="app.id">
                {{app.name}}
              </nuxt-link>
              <p class="heading is-size-7 dropdown-item has-text-grey-light m-b-none">Team</p>
              <nuxt-link tag="a" class="dropdown-item" :to="`/${currentTenant.key}`">
                Settings
              </nuxt-link>
              <hr class="dropdown-divider">
              <nuxt-link tag="a" class="dropdown-item" :to="`/${tenant.key}`" v-for="tenant in otherTenants" :key="tenant.key">
                Switch to <strong>{{tenant.name}}</strong>
              </nuxt-link>
              <hr class="dropdown-divider">
              <p class="heading is-size-7 dropdown-item has-text-grey-light m-b-none">Pollygot</p>
              <nuxt-link tag="a" class="dropdown-item" :to="`/`" >
                Account
              </nuxt-link>
              <nuxt-link tag="a" class="dropdown-item" :to="`/`" >
                Logout
              </nuxt-link>
            </div>
          </div>
        </div>
    </div>

  <div class="" :class="{'top-padding': currentTenant}">
    <slot></slot>
  </div>

</div>
</template>


<script>
import { mapGetters } from 'vuex'
import ClickOutside from 'vue-click-outside'
import PerfectScrollbar from 'perfect-scrollbar'
export default {
  data () {
    return {
      dropdownActive: false,
      sidebarVisible: true,
    }
  },
  computed: {
    ...mapGetters({
      app: 'app',
      tenants: 'tenants',
    }),
    currentApp () {
      let { appId } = this.$route.params
      if (!appId) return null
      return this.app(appId)
    },
    currentTenant () {
      let { appId } = this.$route.params
      if (!appId) return null
      return this.tenants.find(t => t.apps.some(app => (app.id.toString() === appId)))
    },
    otherTenants () {
      return this.tenants.filter(x => (x.id !== this.currentTenant.id))
    }
  },
  methods: {
    toggleSidebar () {
      this.sidebarVisible = !this.sidebarVisible
    }
  },

  // View handlers
  directives: { ClickOutside },
  mounted () {
    let sidebarElement = this.$refs['sidebar']
    this.sidebarScroll = new PerfectScrollbar(sidebarElement,{ wheelPropagation: true })
  },
  beforeDestroy () {
    if (this.sidebarScroll) this.sidebarScroll.destroy()
    this.sidebarScroll = null
  },
}
</script>
<style lang="scss">
@import '../assets/css/vars.scss';
.Sidebar {
  position: relative;
  height: 100vh;
  background: #fff;
  width: 260px;
  transition: all 0.3s;
  overflow: auto;
  overflow-x: hidden;
  box-shadow: 3px 0 5px 0px rgba(0,0,0,0.05);
  z-index: 9;
  .navbar {
    border-bottom: 1px solid $light-grey;
    width: 100%;
    .navbar-brand {
      margin: auto;
      .pollygot-logo {
        img {
          max-height: 3rem;
          height: 3rem;
        }
      }
    }
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
      padding: 20px 20px 0 30px;
    }
    a { //links
      padding: 12px 20px;
      margin: 8px 10px;
      text-transform: uppercase;
      font-size: 0.9rem;
      border-radius: 0;
      border: 1px solid rgba(0,0,0,0);
      &.is-active, &:hover, &.is-block {
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
        color: $grey;
        background: #fff;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.04);
      }
      &.is-active {
        color: $primary;
        background: #fff;
      }
      &.has-icon {
        padding-left:15px;
        .icon {
          margin-right: 10px;
        }
        span {
          line-height: 1.5rem;
        }
      }
      .icon.is-right-icon {
        float: right;
        margin-right: 0px;
      }

    }
  }
  .top-padding {
    padding-top: 80px;
  }
  .tenant-dropdown {
    width: 260px;
    position: fixed;
    top: 0px;
    left: 0px;
    .dropdown-trigger {
      width: 100%;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      background: #fff;
      a {
        display: block;
        padding: 10px 0 10px 20px;
        color: #484848;
        &:hover {
          background: rgba(0,0,0,0.02);
        }
      }
    }
    .dropdown-menu {
      width: 280px;
      margin: 10px;
      margin-top: 0px;
      z-index: 99;
      position: fixed;
      top: 60px;
      left: 0px;
      .dropdown-content {
        box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.1);
      }
    }
  }
}

</style>
