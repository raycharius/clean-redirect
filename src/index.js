const CleanRedirect = require('./clean-redirect');

module.exports = (options) => (req, res, next) => {
  const { callNextOnRedirect, ...config } = options;

  const requestData = {
    method: req.method,
    protocol: req.protocol,
    hostname: req.get('host'),
    originalUrl: req.originalUrl,
  };

  const cleanRedirect = new CleanRedirect(requestData, config);

  if (cleanRedirect.requiresRedirect) {
    res.redirect(cleanRedirect.redirectType, cleanRedirect.getRedirectUrl());
  }

  if (!cleanRedirect.requiresRedirect || callNextOnRedirect) {
    next();
  }
};
