require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const cors = require('cors')


const JWT_SECRET = process.env.JWT_SECRET
const STORE = process.env.DATA_STORE 

// Using a local DB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const location = process.env.LOCAL_DATA_STORE
const adapter = new FileSync(location)
const db = low(adapter)

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())

// JWT middleware
app.use(
  jwt({
    secret: process.env.JWT_SECRET
  }).unless({
    path: '/api/auth/login'
  })
)

// -- Routes --

// [POST] /login
app.post('/login', (req, res, next) => {
  const { username, password } = req.body
  
  let user = null
  if (STORE === 'LOCAL') {
    let valid = db.get('users')
      .filter({ username: username, password: password })
      .value()
    console.log('valid', valid)
    if (!valid.length) return res.status(404).json({ message: 'Invalid username or password' })
    else user = valid[0]
  }
  else {
    return res.status(500).json({ message: 'No datastore initialised' })
  }

  const accessToken = jsonwebtoken.sign(user, JWT_SECRET)

  return res.json({
    token: { accessToken }
  })
})

// [GET] /user
app.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
app.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/auth',
  handler: app
}