<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu">
        <p class="menu-label">Facebook</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/bumblebee/${$route.params.appId}/all`" :class="{'is-active': currentType === 'all'}" >
              Feed
            </nuxt-link>
          </li>
        </ul>
        <p class="menu-label">Mailgun</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/bumblebee/${$route.params.appId}/mailgun`" :class="{'is-active': currentType === 'mailgun'}" >
              Send message
            </nuxt-link>
          </li>
        </ul>
        <p class="menu-label">Twilio</p>
        <ul class="menu-list">
          <li>
            <nuxt-link tag="a" :to="`/bumblebee/${$route.params.appId}/twilio`" :class="{'is-active': currentType === 'twilio'}" >
              Send message
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
  data () {
    return { }
  },
  computed: {
    currentType () {
      return this.$route.params.type
    }
  }
}
</script>

<style lang="scss">

</style>
