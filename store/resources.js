const VIEW_SCOPES = {
  personal: 'personal',
  table: 'table',
}
const VIEWS = {
  calendar: 'calendar',
  kanban: 'kanban',
  list: 'list',
  record: 'record'
}

export const state = () => ({
  swagger: {},
  customViews: [ ] // custom views (pulled from Pollygot Core)
})

export const mutations = {
  setSwagger (state, swaggerDefinition) {
    state.swagger = swaggerDefinition
  }
}

export const getters = {
  // Returns a list of Database tables exposed to PostgREST
  tables: state => (state.swagger.definitions)
    ? Object.entries(state.swagger.definitions).map(([k, v]) => (Object.assign({ ...v, key: k }, v))) // object of objects to array or objects, adding 'key' to each object
    : []
}
