const CleanRedirect = require('./clean-redirect');
const { host, http, https } = require('./constants');

/**
 * @param {Object} [options] Options for the Clean Redirect middleware function.
 * @param {boolean} [options.forceHttps] Redirects non-secure HTTP requests to HTTPS. Defaults to `false`.
 * @param {boolean} [options.toWww] Redirects requests to the naked (root) domain to the WWW domain. Defaults to  `false`. Both `toWww` and `toNaked` cannot set to `true` at the same time.
 * @param {boolean} [options.toNaked] Redirects requests to the WWW domain to the naked (root) domain. Defaults to  `false`. Both `toWww` and `toNaked` cannot set to `true` at the same time.
 * @param {boolean} [options.pathToLowerCase] Redirects requests with capital letters in the path to the same path, but lowercase. Defaults to  `false`.
 * @param {boolean} [options.removeTrailingSlash] Redirects requests with a trailing slash to the same path, without a slash. Defaults to  `false`.
 * @param {boolean} [options.persistQueryString] When set, the query string from the original request will be persisted to the redirect location. Defaults to  `false` (default behavior for Express).
 * @param {number} [options.redirectCode] Sets the redirect code to be used by default. Valid values are `301` and `302`. Defaults to `302`.
 * @param {boolean} [options.callNextOnRedirect] When set to `true`, the `next()` function will be called in the middleware after the redirect has taken place. Defaults to `false`.
 * @param {boolean} [options.deferRedirectToNext] When set to `true`, `res.redirect()` is not called in the middleware. Instead, an instance of CleanRedirect is saved to `res.locals` and available for further governance in the middleware that follows.
 * @param {function} [options.customRedirects] This is a function that accepts three arguments (`req`, `res`, `redirector`) and is called before calling `res.redirect()`. Pass this in to include custom redirect logic using conditions, getters, and setters.
 * @return {function} Configured middleware function for Clean Redirect.
 */

const initCleanRedirectMiddleware = (options) => (req, res, next) => {
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

  if (cleanRedirect.requiresRedirect) {
    res.redirect(cleanRedirect.redirectCode, cleanRedirect.redirectUrl);
  }

  if (callNextOnRedirect || !cleanRedirect.requiresRedirect) {
    return next();
  }
};

module.exports = initCleanRedirectMiddleware;
