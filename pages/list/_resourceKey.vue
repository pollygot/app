<template>
<div>
  <NavBar>
    {{ pageTitle }}
  </NavBar>

  <div class="main">
    <nav class="level is-mobile">
      <div class="level-left"></div>

      <div class="level-right">
        <p class="m-r-none level-item">
          <router-link tag="a"
            class="button is-primary is-rounded"
            :to="'/new/' + resourceKey">
            NEW
          </router-link>
        </p>
      </div>
    </nav>

    <div>

      <a href="#" class="button" @click="test()">test</a>

    </div>
  </div>  
</div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
export default {
  components: {  NavBar },
  watchQuery: ['page'],
  asyncData ({ params }) {
    return {
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      resourceKey: params.resourceKey
    }
  },
  methods: {
    test: () => {
      console.log('called')
    }
  }
}
</script>

<style lang="scss">
.main {
  margin: 20px;
}
</style>

