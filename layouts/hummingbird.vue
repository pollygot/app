<template>
  <div class="columns is-gapless full-height">
    <SideBar>
      <aside class="menu" v-show="tables.length">
        <div v-if="customViewCategories.length" v-for="(category, i) in customViewCategories" :key="'category'+i">
          <p class="menu-label">{{category}}</p>
          <ul class="menu-list">
            <li v-for="(link, i) in viewsInCategory(category)" :key="i">
              <nuxt-link tag="a" :to="`/hummingbird/${$route.params.appId}/view/${link.id}`" :class="{ 'is-active': link.isActive }">
                {{link.label}}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div v-if="resourceList.length">
          <p class="menu-label">Resources</p>
          <ul class="menu-list">
            <li v-for="(link, i) in resourceList" :key="i">
              <nuxt-link tag="a" :to="`/hummingbird/${$route.params.appId}/list/${link.resource}`" :class="{ 'is-active': link.isActive }">
                {{link.label}}
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
  middleware: ['hummingbird'],
  data () {
    return { }
  },
  computed: {
    ...mapGetters({
      tables: 'hummingbird/tables',
      customViews: 'hummingbird/customViews',
    }),
    customViewCategories () {
      return this.customViews.reduce((acc, view) => {
        if (!acc.includes(view.category)) acc.push(view.category)
        return acc
      }, [])
    },
    // Get all database tables from the swagger definition and format them for the sidebar menu
    resourceList () {
      return this.tables
      .map(x => ({
        type: 'list',
        resource: x.key,
        label: x.key.replace(/_/g, ' '),
        isActive: (x.key === this.$route.params.resourceKey)
      }))
    },
  },
  methods: {
    viewsInCategory (categoryName) {
      return this.customViews.filter(x => x.category === categoryName)
    }
  }
}
</script>

<style lang="scss">

</style>
