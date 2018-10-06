//
// mocking out an API calls to Pollygot Core
//

const config = require('../../config/default.js')

export const getAppConfig = (appId) => {
  return new Promise((resolve, reject) => {
    let allUserApps = config.tenants.reduce((acc, tenant) => (acc.concat(tenant.apps)), [])
    let pollyApp = allUserApps.find(x => (x.id.toString() == appId.toString()))
    if (pollyApp) return resolve(pollyApp)
    else return reject('Not found')
  })
}
