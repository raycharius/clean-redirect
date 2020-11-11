const {
  protocol,
  hostname,
  path,
  queryString,
  hash,
  uri,
  url,
} = require('./trump-got-trumped.mock');

const hostnameNoWww = 'trumpgottrumped.com';
const pathTrailingSlash = `${path}/`;
const uriTrailingSlash = `${pathTrailingSlash}${queryString}`;
const uriUpperCase = `${path.toUpperCase()}${queryString}`;
const uriUpperCaseTrailingSlash = `${path.toUpperCase()}/${queryString}`;

module.exports = {
  protocol,
  hostname,
  path,
  queryString,
  hash,
  uri,
  url,
  hostnameNoWww,
  pathTrailingSlash,
  uriTrailingSlash,
  uriUpperCase,
  uriUpperCaseTrailingSlash,
};