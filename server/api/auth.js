require('dotenv').config()
const { Router } = require('express')
const router = Router()
const jsonwebtoken = require('jsonwebtoken')
const db = require('../db')

// [POST] /login
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body
  let user = await db.getUserByUsernameAndPassword(username, password)
  console.log('user', user)
  if (!user) {
    // Invalid
    return res.status(404).json({ message: 'Invalid username or password' })
  } else {
    // Valid
    const accessToken = jsonwebtoken.sign(user, JWT_SECRET)
    return res.json({ token: { accessToken } })
  }
})

// [GET] /user
router.get('/auth/user', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
router.post('/auth/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

module.exports = router
