const protocol = 'https';
const hostname = 'www.trumpgottrumped.com';
const path = '/the/people/have/spoken';
const queryString = '?hello=biden&goodbye=childish-imbecile';
const hash = '#celebration';
const uri = `${path}${queryString}`;
const url = `${protocol}://${hostname}${path}${queryString}`;

module.exports = {
  protocol,
  hostname,
  path,
  queryString,
  hash,
  uri,
  url,
};
