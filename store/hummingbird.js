import Vue from 'vue'
import * as PostgrestHelpers from '../lib/common/postgrestHelpers'

import flat from 'flat'

export const state = () => ({
  swagger: {},
  customViews: [ ], // custom views (pulled from Pollygot Core)
  joinTree: {
    key: 'accounts',
    selected: false,
    // nodes: [
    //   {
    //     key: 'item1',
    //     selected: true,
    //     nodes: [
    //       {
    //         key: 'item1.1',
    //         selected: false,
    //       },
    //       {
    //         key: 'item1.2',
    //         selected: true,
    //         nodes: [
    //           {
    //             key: 'item1.2.1',
    //             selected: false,
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     key: 'item2',
    //     selected: true,
    //   }
    // ]
  }
})

export const mutations = {
  setCustomViews (state, views) {
    state.customViews = views
  },

  setSwagger (state, swaggerDefinition) {
    state.swagger = swaggerDefinition
  },

  selectForeignTable(state, { resourceKey, depth, nodesToAppend}) {
    var recurse = function (tree, d) {
      if (d === depth && tree.key === resourceKey) {
        tree.selected = !tree.selected
        if (nodesToAppend) tree.nodes = nodesToAppend
        return tree
      } else if (tree.nodes && tree.nodes.length) {
        return tree.nodes.forEach(node => recurse(node, d + 1))
      } else {
        console.log('tree', tree)
        return tree
      }
    }
    recurse(state.joinTree, 0)
    let newTree = { ...state.joinTree}
    console.log('newTree', flat(newTree))
    // Vue.set(state, 'joinTree', newTree) // use $set to preserve Vue reactivity
    // state.joinTree = { ...state.joinTree }
  }
}

export const getters = {

  customViews: state => state.customViews,

  // Returns an array of columns for a given table in the database (resourceKey is the table name)
  columnsForResource: state => (resourceKey) => {
    let tableDefinition = state.swagger.definitions[`${resourceKey}`]
    if (!tableDefinition) return []
    let columnArray = Object.entries(tableDefinition.properties).map(([k, v]) => (Object.assign({ ...v, key: k, resource: resourceKey}, v)))
    return columnArray
      .map(x => PostgrestHelpers.enrich(x))
      .map(x => PostgrestHelpers.cleanse(x))
  },

  joinTree: state => state.joinTree,

  // Finds all the primary keys for a resource.
  // @TODO: This is a bit of a hack - would be good if I can do a pull request on PostgREST to improve the swagger spec
  primaryKeysForResource: state => resourceKey => {
    let { properties } = state.swagger.definitions[`${resourceKey}`]
    let columns = Object.entries(properties).map(([k, v]) => (Object.assign({ ...v, key: k }, v))) // convert to array
    return columns
      .filter(x => (x.description && x.description.indexOf('<pk') >= 0)) // filter the PK's
      .map(x => x.key) // only the column name
  },

  // Returns a list of Database tables/views exposed to PostgREST, adding additional data to the columns for each table 
  // and the operations that are allowed on the table data
  tables: state =>  {
    if (!state.swagger.definitions) return []
    // let paths = Object.entries(state.swagger.paths) // we will use this to determine which operations each table allow
    return Object.entries(state.swagger.definitions)
      .map(([k, v]) => (Object.assign({ ...v, key: k }, v)))
      .map(table => {
        let columnArray = Object.entries(table.properties) // change the properties (columns) to an array
          .map(([k, v]) => (Object.assign({ ...v, key: k, resource: table.key }, v)))
          .map(x => PostgrestHelpers.enrich(x))
          .map(x => PostgrestHelpers.cleanse(x))
        let operations = Object.keys(state.swagger.paths[`/${table.key}`]) // what operations are allowed on the table? {'get', 'post', 'patch', 'delete'}
        let isViewOnly = !(operations.includes('post') || operations.includes('patch') || operations.includes('delete'))
        return { ...table, properties: columnArray, operations: operations, isViewOnly: isViewOnly }
      })
  }
}
