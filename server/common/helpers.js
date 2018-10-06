'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const CryptoJS = require('crypto-js');

// These are simple helpers to encrypt/decrypt a string
// Can be used to hash the PostgREST url so that we can use it as a query param
// These should really be migrated over to LZMA - https://github.com/alcor/itty-bitty/tree/master/lzma
// Or we can utilise the browser storage (then use a link shortener when the user wants to share only)
const encrypt = exports.encrypt = x => encodeURIComponent(CryptoJS.AES.encrypt(x, ''));
const decrypt = exports.decrypt = x => CryptoJS.AES.decrypt(decodeURIComponent(x), '').toString(CryptoJS.enc.Utf8);
const serialize = exports.serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

// overrides a tab within a textarea and coverts it to a specified number of spaces
const tabsToSpaces = exports.tabsToSpaces = (event, numSpaces) => {
  let textarea = event.target;
  let spaces = '';
  for (let i = 0; i < numSpaces; i++) {
    spaces += ' ';
  }
  if (event.keyCode === 9) {
    event.preventDefault();
    let v = textarea.value;
    let s = textarea.selectionStart;
    let e = textarea.selectionEnd;
    textarea.value = v.substring(0, s) + spaces + v.substring(e);
    textarea.selectionStart = textarea.selectionEnd = s + numSpaces;
    return false;
  }
};

// performs some cleansing on common database table naming conventions
const cleanseTableName = exports.cleanseTableName = tableName => {
  return tableName.replace(/_/g, ' ');
};

// Checks if a JSON string can be converted to an object
const isValidJsonObject = exports.isValidJsonObject = stringifiedJson => {
  try {
    JSON.parse(stringifiedJson);
    return true;
  } catch (error) {
    return false;
  }
};

// An extremely naiive implementation to Capitalize First Letter of each word in a string
// Wont work for strings without spaces before the letters (eg: this "won't" work)
const toTitleCase = exports.toTitleCase = phrase => {
  return phrase.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};