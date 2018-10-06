'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const moment = require('moment');
const Helpers = require('./helpers');

// rather annoyingly, postgREST seems to remap the type to a proprietary(?) format, we should just use Postgres native types
// Or better yet, do a pull request to improve PostgREST swagger?
const SWAGGER_FIELD_FORMATS = exports.SWAGGER_FIELD_FORMATS = {
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
};

const VALID_FORMATS = exports.VALID_FORMATS = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
  TIME: 'TIME',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO'

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
};const generateFilterString = exports.generateFilterString = criteria => {
  if (!criteria) return '';
  let ors = criteria.map(or => {
    let ands = or.map(and => {
      let s = and.key + '.';
      if (!and.is) s += 'not.';
      s += and.criteria + '.';
      s += and.filterString;
      return s;
    });
    if (ands.length > 0) return `(${ands.join(',')})`;else return false;
  });
  return `(and${ors.join(',and')})`;
};
/**
 * @description Takes a string and turns it into a flat array
 * eg: eg: or=(and(id.gte.1,id.lte.2),and(id.eq.100))
 */
const parseFilterString = exports.parseFilterString = filterString => {
  return filterString.split('and(') // get all the "ands"
  .map(x => x.replace('),', '').replace(')', '')) // do some cleansing of the strings
  .filter(andString => andString.length) // cull any that aren't necessary
  .reduce((acc, x) => {
    // reduce the array of arrays into a single array
    let ands = x.split(',');
    let parsed = ands.map((x, index) => ({
      andOr: index ? 'and' : 'or', // the first in the series is an "or"
      key: x.split('.')[0],
      is: x.split('.').length === 3,
      criteria: x.split('.').length === 3 ? x.split('.')[1] : x.split('.')[2],
      filterString: x.split('.')[2]
    }));
    return acc.concat(parsed);
  }, []);
};

// Add useful data to a column definition
// This is pretty rough - at some stage it would be best to see if the PG team can add some of this from the database introspection 
const enrichSwaggerColumnDefinition = exports.enrichSwaggerColumnDefinition = standardColumn => {
  return Object.assign(_extends({}, standardColumn, {
    isPrimaryKey: isPrimaryKey(standardColumn),
    isForeignKey: isForeignKey(standardColumn),
    label: null
  }));
};

const getRangeDataFromResponseHeaders = exports.getRangeDataFromResponseHeaders = responseHeaders => {
  let rangeHeader = responseHeaders['content-range'];
  return {
    rangeStart: parseInt(rangeHeader.split('-')[0]),
    rangeEnd: parseInt(rangeHeader.split('/')[0].split('-')[1]),
    totalRecords: parseInt(rangeHeader.split('/')[1])
  };
};

// parse the params from a query string
const paramsFromQueryString = exports.paramsFromQueryString = function (queryString) {
  let result = {};
  queryString.split('&').forEach(part => {
    let item = part.split('=');
    result[item[0]] = decodeURIComponent(item[1]);
  });
  if (!!result.select) result.select = result.select;
  if (!!result.limit) result.limit = parseInt(result.limit);
  if (!!result.offset) result.offset = parseInt(result.offset);
  return result;
};

// add useful info to a swagger field
const enrich = exports.enrich = standardField => {
  let label = standardField.key.replace(/_/, ' ');
  let field = _extends({}, standardField, { label: Helpers.toTitleCase(label) });
  field.format = field.format.toUpperCase();
  field.type = field.type.toUpperCase();
  field = calulateDisplayType(field);
  if (isPrimaryKey(field)) field.pk = true;
  let fkInfo = isForeignKey(field);
  if (fkInfo) {
    field.fk = true;
    field.fk_table = fkInfo.table;
    field.fk_col = fkInfo.column;
  }
  return field;
};

// remove unnecessary info from a swagger field
const cleanse = exports.cleanse = field => {
  delete field.description;
  return field;
};

// tries to determine how the fields should be displayed.
// usually the field says it's a "string" when it is, in fact, not a string 😕
const calulateDisplayType = exports.calulateDisplayType = original => {
  let field = _extends({}, original);
  if (field.enum) field.format = VALID_FORMATS.SELECT;else if (field.type === SWAGGER_FIELD_FORMATS.BOOLEAN) field.format = VALID_FORMATS.CHECKBOX;else if (field.type === SWAGGER_FIELD_FORMATS.TIMESTAMP) field.format = VALID_FORMATS.DATETIME;else if (field.type === SWAGGER_FIELD_FORMATS.JSONB) field.format = VALID_FORMATS.TEXTAREA;else if (field.type === SWAGGER_FIELD_FORMATS.INTEGER || field.type === SWAGGER_FIELD_FORMATS.BIGINT) field.format = VALID_FORMATS.NUMBER;else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.BIGINT) field.format = VALID_FORMATS.NUMBER;else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.TEXT) field.format = VALID_FORMATS.TEXTAREA;else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.CHARACTER_VARYING) field.format = VALID_FORMATS.TEXT;else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.DATE) field.format = VALID_FORMATS.DATE;else if (field.type === SWAGGER_FIELD_FORMATS.STRING && field.format === SWAGGER_FIELD_FORMATS.TIMESTAMP_NO_TIMEZONE) field.format = VALID_FORMATS.DATETIME;
  return field;
};

const hasDataChanged = exports.hasDataChanged = field => {
  if (!field.modifiedValue || typeof field.modifiedValue === 'undefined') return true;
  switch (field.type) {
    case SWAGGER_FIELD_FORMATS.TIMESTAMP:
      return moment(field.value).diff(moment(field.modifiedValue), 'minutes');
    case SWAGGER_FIELD_FORMATS.JSON:
      return JSON.stringify(JSON.parse(field.value)) !== JSON.stringify(field.modifiedValue);
    default:
      return field.value !== field.modifiedValue;
  }
};

const cleanseForDatabase = exports.cleanseForDatabase = field => {
  var modified = Object.assign({
    valueToSave: field.value
  }, field);
  switch (modified.type) {
    case SWAGGER_FIELD_FORMATS.JSON:
      modified.valueToSave = field.value ? JSON.parse(modified.value) : null;
  }
  return modified;
};

// checks if a field is a Primary Key
const isPrimaryKey = exports.isPrimaryKey = field => {
  return field.description && field.description.indexOf('<pk') >= 0;
};

// checks if a field is a Foreign Key
const isForeignKey = exports.isForeignKey = field => {
  if (field.description && field.description.indexOf('<fk') >= 0) {
    let fkString = field.description.substring(field.description.indexOf('<fk') + 4, field.description.indexOf('/>'));
    let fkParts = fkString.split(' ');
    return {
      table: fkParts[0].substring(fkParts[0].indexOf('\'') + 1, fkParts[0].lastIndexOf('\'')),
      column: fkParts[1].substring(fkParts[1].indexOf('\'') + 1, fkParts[1].lastIndexOf('\''))
    };
  } else return false;
};

const getUniqueSelector = exports.getUniqueSelector = (primaryKeys, record) => {
  let pkFilters = primaryKeys.map(x => `${x}=eq.${record[x]}`);
  if (!pkFilters.length) return null;else return pkFilters.join('&');
};

//
// Proxy Helpers
//

// must be called from a page or component, passing in the context
const verifySelectorReturnsUnique = exports.verifySelectorReturnsUnique = (() => {
  var _ref = _asyncToGenerator(function* (context, appId, resourceKey, selector) {
    console.log('context', context);
    console.log('appId', appId);
    console.log('resourceKey', resourceKey);
    console.log('selector', selector);
    const url = `/api/postgrest/${appId}/${resourceKey}?q=${encodeURIComponent(selector)}`;
    console.log('url', url);
    let { data: proxyResponse } = yield context.$axios.get(url).catch(function (e) {
      throw e;
    });
    return proxyResponse && proxyResponse.data && proxyResponse.data.length === 1 ? true : false;
  });

  return function verifySelectorReturnsUnique(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

// must be called from a page or component, passing in the context
const createRecord = exports.createRecord = (context, appId, resourceKey, data) => {
  const url = `/api/postgrest/${appId}/${resourceKey}`;
  return context.$axios.post(url, data).catch(e => {
    throw e;
  });
};

// must be called from a page or component, passing in the context
const deleteRecord = exports.deleteRecord = (context, appId, resourceKey, selector) => {
  const url = `/api/postgrest/${appId}/${resourceKey}?q=${encodeURIComponent(selector)}`;
  return context.$axios.delete(url).catch(e => {
    throw e;
  });
};

// must be called from a page or component, passing in the context
const getRecord = exports.getRecord = (context, appId, resourceKey, selector) => {
  console.log('selector', selector);
  const url = `/api/postgrest/${appId}/${resourceKey}?q=${encodeURIComponent(selector)}`;
  const headers = { 'headers': { 'accept': 'application/vnd.pgrst.object+json' } };
  return context.$axios.get(url, headers).catch(e => {
    throw e;
  });
};

// must be called from a page or component, passing in the context
const updateRecord = exports.updateRecord = (context, appId, resourceKey, selector, data) => {
  const url = `/api/postgrest/${appId}/${resourceKey}?q=${encodeURIComponent(selector)}`;
  return context.$axios.patch(url, data).catch(e => {
    throw e;
  });
};