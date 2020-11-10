const CleanRedirect = require('./clean-redirect');
const { host } = require('./constants');

module.exports = (options) => (req, res, next) => {
  const {
    callNextOnRedirect = false,
    customRedirects = null,
    ...config
  } = options;

  const cleanRedirect = new CleanRedirect({
    method: req.method,
    protocol: req.protocol,
    hostname: req.get(host),
    originalUrl: req.originalUrl,
  }, config);

  if (customRedirects) {
    customRedirects(req, res, cleanRedirect);
  }

  if (cleanRedirect.requiresRedirect) {
    res.redirect(cleanRedirect.redirectType, cleanRedirect.getRedirectUrl());
  }

  if (!cleanRedirect.requiresRedirect || callNextOnRedirect) {
    return next();
  }
};
