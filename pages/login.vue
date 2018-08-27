<template>
<div>
  <div v-if="error">{{ error + '' }}</div>
  <div v-if="$auth.$state.redirect">
    You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
  </div>
  <div class="section columns is-centered">

      <div class="column is-8">
        <h4 class="title is-4">Login</h4>
        <div class="box">
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="email" placeholder="Username" v-model="username">
              <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Password" v-model="password">
              <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
            </p>
          </div>
          <div class="field">
            <p class="control">
              <button class="button is-fullwidth is-primary"  @click="login">
                LOGIN
              </button>
            </p>
          </div>
        </div>
        
        <div class="box" >
          <div v-for="s in strategies" :key="s.key" class="mb-2">
          <a @click="$auth.loginWith(s.key)" class="button is-fullwidth is-dark">Login with {{ s.name }}</a>
          </div>
        </div>

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
      username: 'admin',
      password: '',
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
    async login() {
      this.error = null
      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>

<style scoped>
.login-button {
  border: 0;
};
</style>