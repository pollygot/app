


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


// checks if a field is a Primary Key
export const isPrimaryKey = (field) => {
  return (field.description && field.description.indexOf('<pk') >= 0) || false
}

// checks if a field is a Foreign Key
// Returns false, or an object that contains the table name and the primary key of the foreign table
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