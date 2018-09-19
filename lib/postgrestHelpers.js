
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