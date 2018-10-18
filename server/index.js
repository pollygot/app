require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const app = express()

/**
 * Sentry configuration for Express
 */
const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())

const JWT_SECRET = process.env.JWT_SECRET

app.use(
  jwt({ secret: JWT_SECRET }).unless({
    path: '/api/auth/login',
  })
)
app.use(cookieParser())
app.use(bodyParser.json())

// Import API Routes
app.use(require('./api/auth'))
app.use(require('./api/bumblebee'))
app.use(require('./api/kue'))
app.use(require('./api/pollygot'))
app.use(require('./api/postgrest'))

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
