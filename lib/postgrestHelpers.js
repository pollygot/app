
const moment = require('moment')
const Helpers = require('./helpers')

// rather annoyingly, postgREST seems to remap the type to a proprietary(?) format, we should just use Postgres native types
// Or better yet, do a pull request to improve PostgREST swagger?
export const SWAGGER_FIELD_FORMATS = { 
  BOOLEAN: 'BOOLEAN',
  BIGINT: 'BIGINT',
  CHARACTER_VARYING: 'CHARACTER VARYING',
  ENUM: 'ENUM',
  INTEGER: 'INTEGER',
  JSON: 'JSON',
  STRING: 'STRING',
  TIMESTAMP: 'TIMESTAMP',
  TEXT: 'TEXT',
  JSONB: 'JSONB',
  TIMESTAMP_NO_TIMEZONE: 'TIMESTAMP WITHOUT TIME ZONE'
}

export const VALID_FORMATS = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  TIME: 'TIME',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO',
}

/**
 * @description Takes an array of arrays. First dimension is "ORs" and second is "ANDs"
 * eg: 
 *   [
 *     [{ key: 'id', is: true, criteria: 'gte', filterString: '1' }, { key: 'id', is: true, criteria: 'lte', filterString: '5' }],
 *     [{ key: 'id', is: true, criteria: 'eq', filterString: '100' }]
 *   ]
 * 
 * @returns a string - eg: (and(id.gte.1,id.lte.2),and(id.eq.100)) which can be wrapped in an "or" - i.e: or=(...)
 * @param {*} criteria
 */
export const generateFilterString = (criteria) => {
  if (!criteria) return ''
  let ors = criteria.map(or => {
    let ands = or.map(and => {
      let s = and.key + '.'
      if (!and.is) s += 'not.'
      s += and.criteria + '.'
      s += and.filterString
      return s
    })
    if (ands.length > 0) return `(${ands.join(',')})`
    else return false
  })
  return `(and${ors.join(',and')})`
}
/**
 * @description Takes a string and turns it into a flat array
 * eg: eg: or=(and(id.gte.1,id.lte.2),and(id.eq.100))
 */
export const parseFilterString = (filterString) => {
  return filterString
    .split('and(') // get all the "ands"
    .map(x => (x.replace('),', '').replace(')', ''))) // do some cleansing of the strings
    .filter(andString => (andString.length)) // cull any that aren't necessary
    .reduce((acc, x) => { // reduce the array of arrays into a single array
      let ands = x.split(',')
      let parsed = ands.map((x, index) => ({
        andOr: (index) ? 'and' : 'or', // the first in the series is an "or"
        key: x.split('.')[0],
        is: (x.split('.').length === 3),
        criteria: (x.split('.').length === 3) ? x.split('.')[1] : x.split('.')[2],
        filterString: x.split('.')[2]
      }))
      return acc.concat(parsed)
    }, [])
}

// Add useful data to a column definition
// This is pretty rough - at some stage it would be best to see if the PG team can add some of this from the database introspection 
export const enrichSwaggerColumnDefinition = (standardColumn) => {
  return Object.assign({
    ...standardColumn,
    isPrimaryKey: isPrimaryKey(standardColumn),
    isForeignKey: isForeignKey(standardColumn),
    label: null
  })
}

export const getRangeDataFromResponseHeaders = (responseHeaders) => {
  let rangeHeader = responseHeaders['content-range']
  return {
    rangeStart: parseInt(rangeHeader.split('-')[0]),
    rangeEnd: parseInt(rangeHeader.split('/')[0].split('-')[1]),
    totalRecords: parseInt(rangeHeader.split('/')[1])
  }
}

// parse the params from a query string
export const paramsFromQueryString = function (queryString) {
  let result = {}
  queryString.split('&').forEach(part => {
    let item = part.split('=')
    result[item[0]] = decodeURIComponent(item[1])
  })
  if (!!result.select) result.select = result.select
  if (!!result.limit) result.limit = parseInt(result.limit)
  if (!!result.offset) result.offset = parseInt(result.offset)
  return result
}

// add useful info to a swagger field
export const enrich = (standardField) => {
  let label = standardField.key.replace(/_/, ' ')
  let field = { ...standardField, label: Helpers.toTitleCase(label) }
  field.format = field.format.toUpperCase()
  field.type = field.type.toUpperCase()
  field = calulateDisplayType(field)
  if (isPrimaryKey(field)) field.pk = true
  let fkInfo = isForeignKey(field)
  if (fkInfo) {
    field.fk = true
    field.fk_table = fkInfo.table
    field.fk_col = fkInfo.column
  }
  return field
}

// remove unnecessary info from a swagger field
export const cleanse = (field) => {
  delete field.description
  return field
}

// tries to determine how the fields should be displayed.
// usually the field says it's a "string" when it is, in fact, not a string 😕
export const calulateDisplayType = (original) => {
  let field = { ...original}
  if (field.enum) field.format = VALID_FORMATS.SELECT
  else if (field.type === SWAGGER_FIELD_FORMATS.BOOLEAN) field.format = VALID_FORMATS.CHECKBOX
  else if (field.type === SWAGGER_FIELD_FORMATS.TIMESTAMP) field.format = VALID_FORMATS.DATETIME
  else if (field.type === SWAGGER_FIELD_FORMATS.JSONB) field.format = VALID_FORMATS.TEXTAREA
  else if (field.type === SWAGGER_FIELD_FORMATS.INTEGER || field.type === SWAGGER_FIELD_FORMATS.BIGINT) field.format = VALID_FORMATS.NUMBER
  else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.BIGINT) field.format = VALID_FORMATS.NUMBER
  else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.TEXT) field.format = VALID_FORMATS.TEXTAREA
  else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.CHARACTER_VARYING) field.format = VALID_FORMATS.TEXT
  else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.DATE) field.format = VALID_FORMATS.DATE
  else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.TIMESTAMP_NO_TIMEZONE) field.format = VALID_FORMATS.DATETIME
  return field
}

export const hasDataChanged = (field) => {
  if (!field.modifiedValue || (typeof field.modifiedValue === 'undefined')) return true
  switch (field.type) {
    case SWAGGER_FIELD_FORMATS.TIMESTAMP:
      return moment(field.value).diff(moment(field.modifiedValue), 'minutes')
    case SWAGGER_FIELD_FORMATS.JSON:
      return (JSON.stringify(JSON.parse(field.value)) !== JSON.stringify(field.modifiedValue))
    default:
      return field.value !== field.modifiedValue
  }
}

export const cleanseForDatabase = (field) => {
  var modified = Object.assign({
    valueToSave: field.value
  }, field)
  switch (modified.type) {
    case SWAGGER_FIELD_FORMATS.JSON:
      modified.valueToSave = (field.value) ? JSON.parse(modified.value) : null
  }
  return modified
}

// checks if a field is a Primary Key
export const isPrimaryKey = (field) => {
  return (field.description && field.description.indexOf('<pk') >= 0)
}

// checks if a field is a Foreign Key
export const isForeignKey = (field) => {
  if (field.description && field.description.indexOf('<fk') >= 0) {
    let fkString = field.description.substring(field.description.indexOf('<fk') + 4, field.description.indexOf('/>'))
    let fkParts = fkString.split(' ')
    return {
      table: fkParts[0].substring(fkParts[0].indexOf('\'') + 1, fkParts[0].lastIndexOf('\'')),
      column: fkParts[1].substring(fkParts[1].indexOf('\'') + 1, fkParts[1].lastIndexOf('\''))
    }
  } else return false
}