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
      {
        hid: 'description',
        name: 'description',
        content: 'Manage your start up',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Poppins:400,400i,700,700i',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
    ],
  },
  /**
   * Routes
   */
  serverMiddleware: ['~/server/index.js'],
  router: {
    middleware: ['auth'],
  },
  /*
  ** Modules
  */
  modules: [
    [
      '@nuxtjs/auth',
      {
        strategies: {
          local: {
            endpoints: {
              login: { propertyName: 'token.accessToken' },
            },
          },
        },
      },
    ],
    [
      '@nuxtjs/axios',
      {
        baseURL: process.env.API_URL || 'http://localhost:3000',
        proxy: false,
        proxyHeaders: false,
      },
    ],
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    [
      '@nuxtjs/toast',
      {
        position: 'bottom-right',
      },
    ],
  ],
  /*
  ** Global CSS
  */
  css: [{ src: '@/assets/css/main.scss', lang: 'scss' }],
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
        'process.VERSION': require('./package.json').version,
      }),
    ],
    watch: ['server'],
    vendor: [
      'axios',
      'flat',
      'flatpickr',
      'moment',
      'perfect-scrollbar',
      'vue-click-outside',
      'vue-infinite-loading',
      'vuedraggable',
    ],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
    postcss: {
      plugins: {
        'postcss-custom-properties': false,
      },
    },
  },
}
