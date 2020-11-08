const CleanRedirect = require('./src/clean-redirect');

const requestData = {
  method: 'GET',
  protocol: 'http',
  hostname: 'macpaw.com',
  uri: '/cleanmyMAC/?hello=world&goodbye=blue-sky#fuckery',
};

const config = {
  forceHttps: true,
  toWww: true,
  toNaked: false,
  toLowerCase: true,
  removeTrailingSlash: true,
  persistQueryString: true,
  persistHash: true,
  redirectType: 301,
  customRedirects: (cleanRedirect) => cleanRedirect.setPersistHash(false),
};

const cleanRedirect = new CleanRedirect(requestData, config);

console.log(cleanRedirect);
console.log(cleanRedirect.requiresRedirect);
console.log(cleanRedirect.getRedirectUrl());
