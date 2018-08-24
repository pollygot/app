<template>
  <div>
    <NavBar>
      <a class="navbar-item">
        Home
      </a>
    </NavBar>
    <section class="section has-text-centered">
      <div>
        <app-logo/>
        <h1 class="title">
          grest-admin
        </h1>
        <h2 class="subtitle">
          PostgREST Admin Interface
        </h2>
        <div class="links">
          <a
            href="https://nuxtjs.org/"
            target="_blank"
            class="button--green">Documentation</a>
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank"
            class="button--grey">GitHub</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style>

</style>

