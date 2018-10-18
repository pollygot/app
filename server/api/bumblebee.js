require('dotenv').config()
const axios = require('axios')
const Pollygot = require('../common/pollygot')
const { Router } = require('express')
const router = Router()

// Get all apps
router.get('/bumblebee/:appId/apps/:appKey?', async (req, res) => {
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
router.get('/bumblebee/:appId/apps/:appKey/jobs', async (req, res) => {
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
router.post('/bumblebee/:appId/jobs', async (req, res) => {
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

module.exports = router
