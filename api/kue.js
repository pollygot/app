const axios = require('axios')
const express = require('express')
const jwt = require('express-jwt')

const Pollygot = require('../lib/pollygot')

const app = express()
app.use(jwt({ secret: process.env.JWT_SECRET }))

// [GET] /stats
app.get('/:appId/stats', async (req, res, next) => {
  let { appId } = req.params
  let app = await Pollygot.getAppConfig(appId)
  let baseUrl = app.config.url
  console.log('baseUrl', baseUrl)
  let { data } = await axios.get(`${baseUrl}/stats`)
  res.json(data)
})
// [GET] /jobs
app.get('/:appId/jobs', async (req, res, next) => {
  let { appId } = req.params
  let { state, limit, offset:start } = req.query
  let end = parseInt(start) + parseInt(limit) - 1 // inclusive, so need to subtract 1
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl = (state && state !== 'all') ? `${app.config.url}/jobs/${state}/${start}..${end}/desc` : `${app.config.url}/jobs/${start}..${end}/desc`
  let { data } = await axios.get(fullUrl).catch(e => { console.log(e) })
  res.json(data)
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/kue',
  handler: app
}
