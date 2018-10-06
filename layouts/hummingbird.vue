<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu" v-show="tables.length">
        <p class="menu-label">Tables</p>
        <ul class="menu-list">
          <li v-for="(link, i) in tableList" :key="i">
            <nuxt-link tag="a" :to="`/hummingbird/${$route.params.appId}/${link.type}/${link.resource}`" :class="{ 'is-active': link.isActive }">
              {{link.label}}
            </nuxt-link>
          </li>
        </ul>
        <p class="menu-label">Views</p>
        <ul class="menu-list">
          <li v-for="(link, i) in viewList" :key="i">
            <nuxt-link tag="a" :to="`/hummingbird/${$route.params.appId}/${link.type}/${link.resource}`" :class="{ 'is-active': link.isActive }">
              {{link.label}}
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
import { mapGetters } from 'vuex'
export default {
  components: { SideBar },
  middleware: ['hummingbird'],
  data () {
    return { }
  },
  computed: {
    ...mapGetters({
      tables: 'hummingbird/tables',
    }),
    // Get all database tables from the swagger definition and format them for the sidebar menu
    tableList () {
      return this.tables
      .filter(x => !x.isViewOnly)
      .map(x => ({
        type: 'list',
        resource: x.key,
        label: x.key.replace(/_/g, ' '),
        isActive: (x.key === this.$route.params.resourceKey)
      }))
    },
    // Get all database views from the swagger definition and format them for the sidebar menu
    viewList () {
      return this.tables
      .filter(x => x.isViewOnly)
      .map(x => ({
        type: 'list',
        resource: x.key,
        label: x.key.replace(/_/g, ' '),
        isActive: (x.key === this.$route.params.resourceKey)
      }))
    }
  },
}
</script>

<style lang="scss">

</style>
