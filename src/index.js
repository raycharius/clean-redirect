const CleanRedirect = require('./clean-redirect');
const { host } = require('./constants');

module.exports = (options) => (req, res, next) => {
  const {
    callNextOnRedirect = false,
    deferRedirectToNext = false,
    customRedirects = null,
    ...config
  } = options;

  const cleanRedirect = new CleanRedirect({
    protocol: req.protocol,
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

  if (cleanRedirect.requiresRedirect) {
    res.redirect(cleanRedirect.redirectType, cleanRedirect.getRedirectUrl());
  }

  if (callNextOnRedirect || !cleanRedirect.requiresRedirect) {
    return next();
  }
};
