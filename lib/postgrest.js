


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