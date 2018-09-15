require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Restiface by Pollygot',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'PostgREST Admin Interface' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:400,400i,700,700i' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // we need to run most the functionality on the server since there are private jets associated with most tenants' apps
  serverMiddleware: [
    './api/auth',
    './api/kue',
  ],
  router: {
    middleware: ['auth']
  },
  /*
  ** Modules
  */
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/toast',
  ],
  /*
  ** Global CSS
  */
  css: [
    { src: '@/assets/css/main.scss', lang: 'scss' },
    // { src: '~/font-awesome/scss/font-awesome.scss', lang: 'scss' }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#0084ff' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    }
  },
  /*
  ** Module config
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      },
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        client_id: process.env.AUTH0_CLIENT_ID
      }
    }
  },
  axios: {
    proxy: false,
    proxyHeaders: false
  },
  toast: {
    position: 'bottom-right'
  }
}
