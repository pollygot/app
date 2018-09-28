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

      <div class="tenant-dropdown dropdown" :class="{ 'is-active': dropdownActive}" @click="dropdownActive = !dropdownActive">
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
import PerfectScrollbar from 'perfect-scrollbar'
export default {
  data () {
    return {
      dropdownActive: false,
      sidebarVisible: true,
    }
  },
  mounted () {
    let sidebarElement = this.$refs['sidebar']
    const ps = new PerfectScrollbar(sidebarElement)
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
  }
}
</script>
<style lang="scss">
.Sidebar {
  position: relative;
  height: 100vh;
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
