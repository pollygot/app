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
  setCustomViews (state, list) {
    state.customViews = list
  },
  setSwagger (state, swaggerDefinition) {
    state.swagger = swaggerDefinition
  }
}

export const getters = {
  tables: state => (state.swagger.definitions) // returns a list of Database tables exposed to PostgREST
    ? Object.entries(state.swagger.definitions).map(([k, v]) => (Object.assign({ ...v, key: k }, v))) // object to array
    : []
}
