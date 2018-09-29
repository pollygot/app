import * as PostgrestHelpers from '../lib/postgrestHelpers'

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
  // Returns an array of columns for a give table in the database (resourceKey is the table name)
  columnsForResource: state => (resourceKey) => {
    let tableDefinition = state.swagger.definitions[`${resourceKey}`]
    let columnArray = Object.entries(tableDefinition.properties).map(([k, v]) => (Object.assign({ ...v, key: k, resource: resourceKey}, v)))
    return columnArray
      .map(x => PostgrestHelpers.enrich(x))
      .map(x => PostgrestHelpers.cleanse(x))
  },
  // Finds all the primary keys for a resource.
  // @TODO: This is a bit of a hack - would be good if I can do a pull request on PostgREST to improve the swagger spec
  primaryKeysForResource: state => resourceKey => {
    let { properties } = state.swagger.definitions[`${resourceKey}`]
    let columns = Object.entries(properties).map(([k, v]) => (Object.assign({ ...v, key: k }, v))) // convert to array
    return columns
      .filter(x => (x.description && x.description.indexOf('<pk') >= 0)) // filter the PK's
      .map(x => x.key) // only the column name
  },
  // Returns a list of Database tables exposed to PostgREST
  tables: state => (state.swagger.definitions)
    ? Object.entries(state.swagger.definitions).map(([k, v]) => (Object.assign({ ...v, key: k }, v))) // object of objects to array or objects, adding 'key' to each object
    : [],
}
