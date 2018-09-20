const axios = require('axios')
const express = require('express')
const Pollygot = require('../lib/pollygot')
const Helpers = require('../lib/commonjs/helpers')

const app = express()
app.use(express.json())

const PATCH_HEADERS = {
  'headers': { 'Accept': 'application/vnd.pgrst.object+json', 'Prefer': 'return=representation' }
}

// Proxy all GET requests
app.get('/:appId/:resourceKey?', async (req, res, next) => {
  let { appId, resourceKey } = req.params
  let app = await Pollygot.getAppConfig(appId)
  let fullUrl = `${app.config.url}`
  if (resourceKey) fullUrl += `/${resourceKey}`
  if (req.query && req.query.q) fullUrl += `?${Helpers.decrypt(req.query.q.toString())}`
  console.log('fullUrl', fullUrl)
  let headers = _attachHeaders(req.headers)
  axios.get(fullUrl, { headers: headers })
  .then(response => { return res.json({ data: response.data, headers: response.headers }) })
  .catch(e => { return res.status(e.response.status).json(e.response.data) })
})


/**
 * updateRecord - update the database. This uses PATCH so only the data that is passed will be updated
 */
app.patch('/:appId/:resourceKey', async (req, res, next) => {
  if (!req.query) return res.status(422).json({ data: 'Must provide a selector' })
  if (!req.body) return res.status(422).json({ data: 'Must provide a payload' })

  const { appId } = req.params
  const payload = req.body
  let app = await Pollygot.getAppConfig(appId)
  let patchPath = req.url.replace(`/${appId}`, '') // use this Proxy URL, but strip out the appId
  let fullUrl = `${app.config.url}/${patchPath}`

  axios.patch(fullUrl, payload, PATCH_HEADERS)
  .then(response => { return res.json({ data: response.data, headers: response.headers }) })
  .catch(e => { return res.status(e.response.status).json(e.response.data) })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})


const _attachHeaders = (reqeustHeaders) => {
  let headers = {}
  if (reqeustHeaders['range-unit']) headers['range-unit'] = reqeustHeaders['range-unit']
  if (reqeustHeaders['prefer']) headers['prefer'] = reqeustHeaders['prefer']
  if (reqeustHeaders['accept'] && reqeustHeaders['accept'].indexOf('application/vnd.pgrst.object+json') >=0) headers['accept'] = 'application/vnd.pgrst.object+json' // override annoying bug where axios is adding headers
  return headers
}

// -- export app --
module.exports = {
  path: '/api/postgrest',
  handler: app
}
