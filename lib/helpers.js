const CryptoJS = require('crypto-js')


// These are simple helpers to encrypt/decrypt a string
// Can be used to hash the PostgREST url so that we can use it as a query param
export const encrypt = x => encodeURIComponent(CryptoJS.AES.encrypt(x, ''))
export const decrypt = x => CryptoJS.AES.decrypt(decodeURIComponent(x), '').toString(CryptoJS.enc.Utf8)

//
// POSTGREST HELPERS
// 

export const getRangeDataFromPostgrestHeaders = (responseHeaders) => {
  let rangeHeader = responseHeaders['content-range']
  return {
    rangeStart: parseInt(rangeHeader.split('-')[0]),
    rangeEnd: parseInt(rangeHeader.split('/')[0].split('-')[1]),
    totalRecords: parseInt(rangeHeader.split('/')[1])
  }
}