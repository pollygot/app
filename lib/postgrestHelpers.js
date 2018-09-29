
const moment = require('moment')
const Helpers = require('./helpers')

const FIELD_TYPES = {
  BIGINT: 'bigint',
  ENUM: 'enum',
  INT: 'integer',
  JSON: 'json',
  STRING: 'string',
  TIMESTAMP: 'timestamp'
}
const SWAGGER_FIELD_FORMATS = {
  BIGINT: 'bigint',
  JSONB: 'jsonb',
  TIMESTAMP_NO_TIMEZONE: 'timestamp without time zone'
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
  if (isPrimaryKey(field)) field.pk = true
  let fkInfo = isForeignKey(field)
  if (fkInfo) {
    field.fk = true
    field.fk_table = fkInfo.table
    field.fk_col = fkInfo.column
  }
  field = calulateDisplayType(field)
  return field
}

// remove unnecessary info from a swagger field
export const cleanse = (field) => {
  delete field.description
  return field
}

// tries to determine how the fields should be displayed.
// usually the field says it's a "string" when it is, in fact, not a string 😕
export const calulateDisplayType = (swaggerField) => {
  // check if it's a enum and change type "string" to "enum"
  if (swaggerField.enum) return Object.assign({ ...swaggerField, type: FIELD_TYPES.ENUM })

  // check if it's a number and change type "string" to "number"
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.BIGINT) return Object.assign({ ...swaggerField, type: FIELD_TYPES.INT })

  // check if it's a timestamp and change type "string" to "timestamp"
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.TIMESTAMP_NO_TIMEZONE) return Object.assign({ ...swaggerField, type: FIELD_TYPES.TIMESTAMP, hasTimezone: false })

  // check if it's a jsonb and change type "string" to "json"s
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.JSONB) return Object.assign({ ...swaggerField, type: FIELD_TYPES.JSON })

  // else return it as it is
  else return swaggerField
}

// add useful value data to a field
export const enrichValues = (standardField) => {
  let field = { ...standardField, originalValue: standardField.value }
  if (field.type === FIELD_TYPES.TIMESTAMP) field = enrichTimestampField(field)
  if (field.type === FIELD_TYPES.JSON) field = enrichJsonField(field)
  return field
}

// extracts valid info from a timestamp for easier display and manipulation.
export const enrichTimestampField = (timestampField) => {
  if (!timestampField.value) return timestampField
  let momentDate = moment(timestampField.value)
  let jsDate = new Date(Date.parse(timestampField.value))
  return Object.assign({
    ...timestampField,
    value: jsDate.toISOString().substring(0, 19),
    originalValue: jsDate.toISOString(),
    date: jsDate,
    isoString: momentDate.toISOString(),
    dateString: timestampField.value.substring(0, 10),
    timeString: timestampField.value.substring(11)
  })
}

export const enrichJsonField = (field) => {
  return Object.assign({
    ...field,
    value: JSON.stringify(field.originalValue, null, 2) // spacing level = 2
  })
}


export const hasDataChanged = (field) => {
  if (!field.value || (typeof field.value === 'undefined')) return true
  switch (field.type) {
    case FIELD_TYPES.TIMESTAMP:
      return moment(field.value).diff(moment(field.originalValue), 'minutes')
    case FIELD_TYPES.JSON:
      return (JSON.stringify(JSON.parse(field.value)) !== JSON.stringify(field.originalValue))
    default:
      return field.value !== field.originalValue
  }
}

export const cleanseForDatabase = (field) => {
  var modified = Object.assign({
    valueToSave: field.value
  }, field)
  switch (modified.type) {
    case FIELD_TYPES.JSON:
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