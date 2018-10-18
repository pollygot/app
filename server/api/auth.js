require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const db = require('../db')

/**
 * Set up app @todo: refactor this into an index.js, with the routes in a subfolder
 */
const JWT_SECRET = process.env.JWT_SECRET
const app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
  jwt({ secret: process.env.JWT_SECRET })
  .unless({
    path: '/api/auth/login'
  })
)

// -- Routes --

// [POST] /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  let user = await db.getUserByUsernameAndPassword(username, password)
  console.log('user', user)
  if (!user) { // Invalid
    return res.status(404).json({ message: 'Invalid username or password' })
  } else { // Valid
    const accessToken = jsonwebtoken.sign(user, JWT_SECRET)
    return res.json({ token: { accessToken } })
  }
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