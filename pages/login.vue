<template>
<div>
  <div class="section columns is-centered">

      <div class="column is-8">

        <div v-if="$auth.$state.redirect" class="notification is-danger">
          You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
        </div>

        <div v-if="error" class="notification is-warning">
          {{ error + '' }}
        </div>

        <h4 class="title is-4">Login</h4>

        <div class="box">
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="email" placeholder="Username" v-model="username">
              <span class="icon is-left"><i class="fas fa-envelope"></i></span>
            </p>
          </div>
          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Password" v-model="password">
              <span class="icon is-left"><i class="fas fa-lock"></i></span>
            </p>
          </div>
          <div class="field">
            <div class="buttons is-right">
              <button class="button is-rounded is-primary" @click="login">LOGIN</button>
            </div>
          </div>
        </div>

        <div class="box" v-if="strategies.length">
          <div v-for="s in strategies" :key="s.key" class="">
            <a @click="$auth.loginWith(s.key)" class="button is-fullwidth is-rounded is-outlined is-dark">Login with {{ s.name }}</a>
          </div>
        </div>

      </div>

  </div>
</div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: ['auth'],
  data() {
    return {
      username: 'admin',
      password: '',
      error: null
    }
  },
  computed: {
    strategies: () => {
      let all = []
      if (process.env.AUTH0_DOMAIN) all.push({ key: 'auth0', name: 'Auth0', color: '#ec5425' })
      return all
    },
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
      let response = await this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => { 
          console.log('e', e)
          this.error = e + '' })
      if (this.response && this.redirect) this.$router.push({ path: this.redirect })
      else if (this.response) this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped>
.login-button {
  border: 0;
};
</style>
