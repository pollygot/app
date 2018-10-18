<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu">
        <p class="menu-label">Team</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon is-active">
              <span class="icon"><i class="fas fa-th"></i></span>
              Apps
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon">
              <span class="icon"><i class="fas fa-users"></i></span>
              Users
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon">
              <span class="icon"><i class="fas fa-cog"></i></span>
              Settings
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/`" class="has-icon has-text-grey-light">
              <span class="icon"><i class="fas fa-chevron-left"></i></span>
              Account
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
