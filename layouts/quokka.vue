<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu">
        <p class="menu-label">JOBS</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}`" class="has-icon">
              <span>New</span>
              <span class="icon is-right-icon"><i class="fas fa-plus"></i></span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/all`" :class="{'is-active': currentState === 'all'}" >
              ALL
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/inactive`" :class="{'is-active': currentState === 'inactive'}" >
              QUEUED
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/active`" :class="{'is-active': currentState === 'active'}" >
              ACTIVE
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/failed`" :class="{'is-active': currentState === 'failed'}" >
              FAILED
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/complete`" :class="{'is-active': currentState === 'complete'}" >
              COMPLETE
            </nuxt-link>
          </li>
          <li>
            <nuxt-link tag="a" :to="`/quokka/${$route.params.appId}/delayed`" :class="{'is-active': currentState === 'delayed'}" >
              DELAYED
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
  computed: {
    currentState() {
      return this.$route.params.state
    },
  },
}
</script>

<style lang="scss">
</style>
