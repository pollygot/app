/**
 * Make this Node friendly
 */
'use strict'
Object.defineProperty(exports, '__esModule', {
  value: true,
})

/**
 * Imports
 */
const axios = require('axios')
const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

// At the moment I'm using sheetmetal.io while I prototype
const METAL_URL = process.env.SHEET_METAL_POLLYGOT
const METAL_KEY = process.env.SHEET_METAL_KEY
const METAL_USER = process.env.SHEET_METAL_USER

/**
 * Exported methods
 */
const getTenantsForUser = (exports.getTenantsForUser = async userId => {
  try {
    const url = `${METAL_URL}/tenants!A1:C50?key=${METAL_KEY}`
    console.log('url', url)
    let { data: tenants } = (await axios.get(url)) || []
    return (
      users.find(x => x.username === username && x.password === password) ||
      null
    )
  } catch (e) {
    _handleAxiosError(e)
    return null
  }
})

const getUserByUsernameAndPassword = (exports.getUserByUsernameAndPassword = async (
  username,
  password
) => {
  try {
    const url = `${METAL_URL}/users!A1:C50?key=${METAL_KEY}&user=${METAL_USER}`
    console.log('url', url)
    let { data: users } = (await axios.get(url)) || []
    return (
      users.find(x => x.username === username && x.password === password) ||
      null
    )
  } catch (e) {
    _handleAxiosError(e)
    return null
  }
})

/**
 * Private helpers
 */

const _handleAxiosError = function(error) {
  let e = null
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.status);
    // console.log(error.response.headers);
    // console.log(error.response.data);
    e = error.response.data
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
    e = error.request
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', error.message);
    e = error.message
  }
  console.log('e', e)
  Sentry.captureException(e)
}
