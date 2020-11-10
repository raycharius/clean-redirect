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
const uriTrailingSlash = `${pathTrailingSlash}${queryString}${hash}`;
const uriUpperCase = `${path.toUpperCase()}${queryString}${hash}`;
const uriUpperCaseTrailingSlash = `${path.toUpperCase()}/${queryString}${hash}`;

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