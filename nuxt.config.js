require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Pollygot',
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
    './api/postgrest',
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
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#0084ff' },
  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': require('./package.json').version
      })
    ],
    transpile: [ './lib/**/*', './api/**/*' ],
    vendor: ['axios', 'moment', 'perfect-scrollbar', 'vue-click-outside', 'vue-infinite-loading', 'vuedraggable'],
    watch: [ './api/**/*' ],
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
    baseURL: process.env.API_URL || 'http://localhost:3000',
    proxy: false,
    proxyHeaders: false
  },
  toast: {
    position: 'bottom-right'
  }
}
