require('dotenv').config()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const location = process.env.LOCAL_DATA_STORE
const adapter = new FileSync(location)
const db = low(adapter)

// Set some defaults
db
.defaults({
  apps: [], // stores the apps for each tenant
  users: [
    { id: 1, username: 'admin', password: 'admin' }
  ],
  tenants: [], 

  // HummingBird
  hummingbird_views: [], // custom views (table joins etc)
  hummingbird_history: [] // save every record CRUD
})
.write()
