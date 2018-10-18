const axios = require('axios')
const { Router } = require('express')
const router = Router()

const Pollygot = require('../common/pollygot')

// [GET] /stats
router.get('/kue/:appId/stats', async (req, res, next) => {
  let { appId } = req.params
  let app = await Pollygot.getAppConfig(appId)
  let baseUrl = app.config.url
  console.log('baseUrl', baseUrl)
  let { data } = await axios.get(`${baseUrl}/stats`)
  res.json(data)
})
// [GET] /jobs
router.get('/kue/:appId/jobs', async (req, res, next) => {
  let { appId } = req.params
  let { state, limit, offset: start } = req.query
  let end = parseInt(start) + parseInt(limit) - 1 // inclusive, so need to subtract 1
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl =
    state && state !== 'all'
      ? `${app.config.url}/jobs/${state}/${start}..${end}/desc`
      : `${app.config.url}/jobs/${start}..${end}/desc`
  let { data } = await axios.get(fullUrl).catch(e => {
    console.log(e)
  })
  res.json(data)
})

module.exports = router
