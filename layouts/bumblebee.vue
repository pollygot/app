<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu">
        <div v-for="(app, i) in activeApps" :key="i">
          <p class="menu-label">{{app.replace(/_/g, ' ')}}</p>
          <ul class="menu-list">
            <li v-for="(action, j) in activeActions(app)" :key="j">
              <nuxt-link 
                tag="a" 
                :to="`/bumblebee/${$route.params.appId}/${app}/${action}`" 
                :class="{'is-active': ($route.params.type === app && $route.params.action === action)}" >
                {{action.replace(/_/g, ' ')}}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </aside>
    </SideBar>

    <div class="column" id="content">
      <nuxt/>
    </div>
  </div>
</template>

<script>
import SideBar from '../components/SideBar.vue'
import { mapGetters } from 'vuex'
export default {
  components: { SideBar },
  middleware: ['bumblebee'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      apps: 'bumblebee/apps',
    }),
    activeApps() {
      // we only the name of one of
      return this.apps.reduce((acc, app) => {
        if (!acc.includes(app.type)) acc.push(app.type)
        return acc
      }, [])
      return []
    },
  },
  methods: {
    activeActions(appType) {
      let actions = this.apps
        .filter(x => x.type === appType)
        .reduce((acc, app) => {
          let actionName = app.actions.map(x => x.action)
          return acc.concat(actionName)
        }, [])
      let unique = Array.from(new Set(actions))
      return unique.sort((a, b) => {
        if (a > b) return a
        else return b
      })
    },
  },
}
</script>

<style lang="scss">
</style>
