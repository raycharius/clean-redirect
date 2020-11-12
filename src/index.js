const CleanRedirect = require('./clean-redirect');
const { host, http, https } = require('./constants');

module.exports = (options) => (req, res, next) => {
  const {
    callNextOnRedirect = false,
    deferRedirectToNext = false,
    customRedirects = null,
    ...config
  } = options;

  const cleanRedirect = new CleanRedirect({
    protocol: !req.secure && req.get('x-forwarded-proto').toLowerCase() !== https ? http : https,
    hostname: req.get(host),
    uri: req.originalUrl,
  }, config);

  if (customRedirects) {
    customRedirects(req, res, cleanRedirect);
  }

  if (deferRedirectToNext) {
    res.locals.cleanRedirect = cleanRedirect;

    return next();
  }

  if (cleanRedirect.requiresRedirect()) {
    res.redirect(cleanRedirect.redirectCode, cleanRedirect.getRedirectUrl());
  }

  if (callNextOnRedirect || !cleanRedirect.requiresRedirect()) {
    return next();
  }
};
