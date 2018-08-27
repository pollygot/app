const CryptoJS = require('crypto-js')
const moment = require('moment')

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

// These are simple helpers to encrypt/decrypt a string
// Can be used to hash the PostgREST url so that we can use it as a query param
export const encrypt = x => encodeURIComponent(CryptoJS.AES.encrypt(x, ''))
export const decrypt = x => CryptoJS.AES.decrypt(decodeURIComponent(x), '').toString(CryptoJS.enc.Utf8)

//
// POSTGREST / SWAGGER HELPERS
// 

export const getRangeDataFromPostgrestHeaders = (responseHeaders) => {
  let rangeHeader = responseHeaders['content-range']
  return {
    rangeStart: parseInt(rangeHeader.split('-')[0]),
    rangeEnd: parseInt(rangeHeader.split('/')[0].split('-')[1]),
    totalRecords: parseInt(rangeHeader.split('/')[1])
  }
}

// tries to determine how the fields should be displayed.
// usually the field says it's a "string" when it is, in fact, not a string 😕
export const calulateDisplayTypeFromSwaggerInfo = (swaggerField) => {
  // check if it's a enum and change type "string" to "enum"
  if (swaggerField.enum) return Object.assign({ ...swaggerField, type: FIELD_TYPES.ENUM })

  // check if it's a number and change type "string" to "number"
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.BIGINT) return Object.assign({ ...swaggerField, type: FIELD_TYPES.INT })

  // check if it's a timestamp and change type "string" to "timestamp"
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.TIMESTAMP_NO_TIMEZONE) return Object.assign({ ...swaggerField, type: FIELD_TYPES.TIMESTAMP, hasTimezone: false })

  // check if it's a jsonb and change type "string" to "json"
  else if (swaggerField.format === SWAGGER_FIELD_FORMATS.JSONB) return Object.assign({ ...swaggerField, type: FIELD_TYPES.JSON })

  // else return it as it is
  else return swaggerField
}

// add useful data to a field
export const enrichSwaggerField = (standardField) => {
  let field = Object.assign({
    ...standardField,
    isPrimaryKey: isPrimaryKey(standardField),
    isForeignKey: isForeignKey(standardField),
    originalValue: standardField.value,
    label: standardField.key.replace(/_/, ' ')
  })
  if (field.type === FIELD_TYPES.TIMESTAMP) field = enrichTimestampField(field)
  if (field.type === FIELD_TYPES.JSON) field = enrichJsonField(field)
  return field
}

// extracts valid info from a timestamp for easier display and manipulation.
export function enrichTimestampField(timestampField) {
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

export function enrichJsonField(field) {
  return Object.assign({
    ...field,
    value: JSON.stringify(field.originalValue, null, 2) // spacing level = 2
  })
}

export function hasDataChanged(field) {
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

export function cleanseForDatabase(field) {
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