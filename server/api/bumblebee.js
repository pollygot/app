require('dotenv').config()
const axios = require('axios')
const express = require('express')
const Pollygot = require('../common/pollygot')
const jwt = require('express-jwt')

const app = express()
app.use(express.json())
app.use(jwt({ secret: process.env.JWT_SECRET }))

// Get all apps
app.get('/:appId/apps/:appKey?', async (req, res) => {
  let { appId, appKey } = req.params // @TODO: implement single via appKey
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl = `${app.config.url}/v1/admin/apps/`
  console.log('Bumblebee GET: fullUrl', fullUrl)
  axios
    .get(fullUrl)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      return res.status(e.response.status).json(e.response.data)
    })
})

// Get jobs for an app
app.get('/:appId/apps/:appKey/jobs', async (req, res) => {
  let { appId, appKey } = req.params // @TODO: implement single via appKey
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl = `${app.config.url}/v1/apps/${appKey}/jobs`
  console.log('Bumblebee GET: fullUrl', fullUrl)
  axios
    .get(fullUrl)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      return res.status(e.response.status).json(e.response.data)
    })
})

// Create a new Job
app.post('/:appId/jobs', async (req, res) => {
  let { appId } = req.params // @TODO: implement single via appKey
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl = `${app.config.url}/v1/jobs`
  const payload = req.body
  console.log('Bumblebee POST: fullUrl', fullUrl)
  axios
    .post(fullUrl, payload)
    .then(response => {
      return res.json(response.data)
    })
    .catch(e => {
      return res.status(e.response.status).json(e.response.data)
    })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/bumblebee',
  handler: app,
}
