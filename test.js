const CleanRedirect = require('./src/clean-redirect');

const requestData = {
  method: '',
  protocol: '',
  hostname: '',
  originalUrl: ''
};

const config = {
  forceHttps: true,
  toWww: false,
  toNaked: false,
  toLowerCase: true,
  removeTrailingSlash: true,
  persistQueryString: true,
  redirectType: 301,
  customRedirects: (cleanRedirect) => cleanRedirect,
};

const cleanRedirect = new CleanRedirect(requestData, config);

console.log(cleanRedirect);
console.log(cleanRedirect.requiresRedirect);
console.log(cleanRedirect.getRedirectUrl());
