<template>
<div>
  <h2 class="text-center">Login</h2>
  <hr>
  <div v-if="error">{{ error + '' }}</div>
  <div v-if="$auth.$state.redirect">
    You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
  </div>
  <div class="section columns is-centered">
    <div md="4" class="column is-4 has-text-centered">
        <b-card title="Social Login" bg-variant="light">
          <div v-for="s in strategies" :key="s.key" class="mb-2">
          <a @click="$auth.loginWith(s.key)" class="button">Login with {{ s.name }}</a>
          </div>
        </b-card>
    </div>
  </div>
</div>
</template>

<script>
export default {
  layout: ['auth'],
  middleware: ['auth'],
  data() {
    return {
      error: null
    }
  },
  computed: {
    strategies: () => ([
      { key: 'auth0', name: 'Auth0', color: '#ec5425' },
    ]),
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    },
    isCallback() {
      return Boolean(this.$route.query.callback)
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.login-button {
  border: 0;
};
</style>