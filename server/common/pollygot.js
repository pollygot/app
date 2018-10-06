'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//
// mocking out an API calls to Pollygot Core
//

const config = require('../../config/default.js');

const getAppConfig = exports.getAppConfig = appId => {
  return new Promise((resolve, reject) => {
    let allUserApps = config.tenants.reduce((acc, tenant) => acc.concat(tenant.apps), []);
    let pollyApp = allUserApps.find(x => x.id.toString() == appId.toString());
    if (pollyApp) return resolve(pollyApp);else return reject('Not found');
  });
};

const getAppViews = exports.getAppViews = appId => {
  return new Promise((resolve, reject) => {
    let allUserApps = config.tenants.reduce((acc, tenant) => acc.concat(tenant.apps), []);
    let pollyApp = allUserApps.find(x => x.id.toString() == appId.toString());
    if (pollyApp) return resolve(pollyApp.views);else return reject('Not found');
  });
};