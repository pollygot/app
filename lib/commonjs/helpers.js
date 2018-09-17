const CryptoJS = require('crypto-js')
const moment = require('moment')

// These are simple helpers to encrypt/decrypt a string
// Can be used to hash the PostgREST url so that we can use it as a query param
module.exports.encrypt = x => encodeURIComponent(CryptoJS.AES.encrypt(x, ''))
module.exports.decrypt = x => CryptoJS.AES.decrypt(decodeURIComponent(x), '').toString(CryptoJS.enc.Utf8)
module.exports.serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
