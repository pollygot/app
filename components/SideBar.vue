<template>
<div class="sidebar column is-narrow is-hidden-mobile" v-show="sidebarVisible">

  <nav class="navbar has-text-centered">
    <div class="navbar-brand">
      <nuxt-link tag="a" class="pollygot-logo navbar-item" :to="'/'">
          <img src="/img/pollygot-logo.svg" alt="Pollygot"  />
      </nuxt-link>
    </div>
  </nav>

  <slot></slot>

</div>
</template>


<script>
export default {
  data () {
    return {
      sidebarVisible: true,
    }
  },
  methods: {
    toggleSidebar () {
      this.sidebarVisible = !this.sidebarVisible
    }
  }
}
</script>
