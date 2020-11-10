const protocol = 'http';
const hostname = 'www.blacklivesmatter.com';
const path = '/for/brianna/ahmaud/and/george';
const queryString = '?never=again';
const hash = '#thiswillnotstand';
const uri = `${path}${queryString}${hash}`;
const url = `${protocol}://${hostname}${path}${queryString}${hash}`;

module.exports = {
  protocol,
  hostname,
  path,
  queryString,
  hash,
  uri,
  url,
};