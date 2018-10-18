<template>
  <div class="Apps">
    <section class="section" >
      
      
      <h2 class="title is-2">Settings</h2>

      <a class="button" @click="logout()">Logout</a>

    </section>
  </div>
</template>

<script>
export default {
  computed: {},
  methods: {
    logout: async function() {
      let logout = await this.$axios.$post('/api/auth/logout')
      let user = await this.$axios.$get('/api/auth/user')
      console.log('logout', logout)
      console.log('user', user)
      // this.$router.push({ path: '/login' })
    },
  },
}
</script>
