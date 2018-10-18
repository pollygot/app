<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu">
        <p class="menu-label">Account</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon is-active">
              <span class="icon"><i class="fas fa-users"></i></span>
              Teams
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/account/profile`" class="has-icon">
              <span class="icon"><i class="fas fa-user"></i></span>
              Profile
            </nuxt-link>
          </li>
          <!-- <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon">
              <span class="icon"><i class="fas fa-gift"></i></span>
              Invites
            </nuxt-link>
          </li> -->
          <li>
            <nuxt-link tag="a" :to="`/account/settings`" class="has-icon">
              <span class="icon"><i class="fas fa-cog"></i></span>
              Settings
            </nuxt-link>
          </li>
        </ul>
      </aside>
    </SideBar>
    <div class="column" id="content">
      <nuxt/>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue'
export default {
  components: { SideBar },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
</style>
