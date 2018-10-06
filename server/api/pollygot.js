require('dotenv').config()
const axios = require('axios')
const express = require('express')
const Pollygot = require('../common/pollygot')
const Helpers = require('../common/helpers')
const jwt = require('express-jwt')

const app = express()
app.use(express.json())
app.use(jwt({ secret: process.env.JWT_SECRET }))

//
// mocking out an API calls to Pollygot Core
//
const config = require('../../config/default.js')

// get all the config for a specific app
app.get('/app/:appId/', async (req, res) => {
  let { appId } = req.params
  let allUserApps = config.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), [])
  let pollyApp = allUserApps.find(x => (x.id.toString() == appId.toString()))
  if (pollyApp) return res.json(pollyApp)
  else return res.status(404).send('Not Found.')
})

// get all the custom views for a specific app
app.get('/app/:appId/views', async (req, res) => {
  let { appId } = req.params
  let allUserApps = config.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), [])
  let pollyApp = allUserApps.find(x => (x.id.toString() == appId.toString()))
  if (pollyApp) return res.json(pollyApp.views)
  else return res.status(404).send('Not Found.')
})


// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/pollygot',
  handler: app
}
