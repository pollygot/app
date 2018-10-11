require('dotenv').config()
const express = require('express')
const jwt = require('express-jwt')

const app = express()
app.use(express.json())
app.use(jwt({ secret: process.env.JWT_SECRET }))

// get all the config for a specific app
app.get('/app/:appId/', async (req, res) => {
  let { appId } = req.params
  let pollyApp = getApp(appId)
  console.log('pollyApp', pollyApp)
  if (pollyApp) return res.json(pollyApp)
  else return res.status(404).send('Not Found.')
})

// get all the custom views for a specific app
app.get('/app/:appId/views', async (req, res) => {
  let { appId } = req.params
  let pollyApp = getApp(appId)
  if (!pollyApp) return res.status(404).send('Not Found.')
  else {
    let views = getViewsForApp(pollyApp)
    return res.json(views)
  }
})

// get all the config for a specific app
app.get('/hummingbird/history/:appId/:resourceKey/:identifier', async (req, res) => {
  let { appId, resourceKey, identifier } = req.params
  let history = getHummingbirdRecordHistory(appId, resourceKey, identifier) || []
  return res.json(history)
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



//
// mocking out an API calls to Pollygot Core
//
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(process.env.LOCAL_DATA_STORE)
const db = low(adapter)

const snakeToCamel = (s) => {
  return s.replace(/(\_\w)/g, (m) => (m[1].toUpperCase()))
}
const objectKeysToCamel = (obj) => {
  let result = {}
  Object.keys(obj).forEach(x => result[`${snakeToCamel(x)}`] = obj[x])
  return result
}
const getApp = (appId) => {
  console.log('api/pollygot getApp:', appId)
  let apps = db.get('apps').value()
  return apps.find(x => x.id == appId) || null // string == int
}
const getViewsForApp = (app) => {
  console.log('api/pollygot getViewsForApp:', app)
  switch (app.app_key) {
    case 'HUMMINGBIRD':
      let views = db
        .get('hummingbird_views').value()
        .filter(x => x.app_id == app.id) // string == int
        .map(x => objectKeysToCamel(x))
      return views || null // string == int
    default:
      return []
  }
}
const getHummingbirdRecordHistory = (appId, resourceKey, identifier) => {
  let history = db.get('hummingbird_history').value() || []
  console.log('history', history)
  console.log('appId', appId)
  console.log('resourceKey', resourceKey)
  console.log('identifier', identifier)
  return history.filter(x => (x['app_id'] == appId && x['resource_key'] == resourceKey && x['identifier'] == identifier))
}