const helper = require('./helper');
const validator = require('./validator');
const {
  www,
  slash,
  blankString,
  https,
} = require('./constants');

class CleanRedirect {
  constructor(requestData, config) {
    this.config = {
      forceHttps: config.forceHttps || false,
      toWww: config.toWww || false,
      toNaked: config.toNaked || false,
      toLowerCase: config.toLowerCase || false,
      removeTrailingSlash: config.removeTrailingSlash || false,
      persistQueryString: config.persistQueryString || false,
      redirectType: config.redirectType || null,
    };

    validator.validateConfig(this.config);
    Object.freeze(this.config);

    this.originalRequestData = {
      method: requestData.method,
      protocol: requestData.protocol,
      hostname: requestData.hostname,
      path: helper.parsePath(requestData.originalUrl),
      queryString: helper.parseQueryString(requestData.originalUrl),
    };

    validator.validateRequestData(requestData);
    Object.freeze(this.originalRequestData);

    this.mutatedRequestData = this.mutateRequestData();

    validator.validateRequestData(this.mutatedRequestData);
    Object.seal(this.mutatedRequestData);

    this.customRedirects = config.customRedirects || null;

    validator.validateCustomRedirects(this.customRedirects);

    this.pathOverride = null;

    // If there is a custom redirect function, call it at end of constructor

    if (this.customRedirects) {
      this.customRedirects(this);
    }
  }

  mutateRequestData() {
    return {
      method: this.originalRequestData.method,
      protocol: this.mutateProtocol(this.originalRequestData.protocol, this.config),
      hostname: this.mutateHostname(this.originalRequestData.hostname, this.config),
      path: this.mutatePath(this.originalRequestData.path, this.config),
      queryString: this.mutateQueryString(this.originalRequestData.queryString, this.config),
    };
  }

  mutateProtocol() {
    return this.config.forceHttps ? https : this.originalRequestData.protocol;
  }

  mutateHostname() {
    if (this.config.toWww) {
      return this.originalRequestData.hostname.startsWith(www)
        ? this.originalRequestData.hostname
        : `${www}${this.originalRequestData.hostname}`;
    }

    if (this.config.toNaked) {
      const startWwwIndex = this.originalRequestData.hostname.indexOf(www);

      return (startWwwIndex >= 0)
        ? this.originalRequestData.hostname.slice(4)
        : this.originalRequestData.hostname;
    }

    return this.originalRequestData.hostname;
  }

  mutatePath() {
    const mutatedPath = this.config.toLowerCase
      ? this.originalRequestData.path.toLowerCase()
      : this.originalRequestData.path;
    const pathLength = mutatedPath.length;
    const hasTrailingSlash = mutatedPath.charAt(pathLength - 1) === slash;

    if (this.config.removeTrailingSlash && hasTrailingSlash && mutatedPath !== slash) {
      return mutatedPath.slice(0, mutatedPath.length - 1);
    }

    return mutatedPath;
  }

  // The persistQueryString option is here since by default, Express does not persist, but there are cases where this is necessary

  mutateQueryString() {
    return this.config.persistQueryString ? this.originalRequestData.queryString : blankString;
  }

  getRedirectUrl() {
    // pathOverride is used to provide an interface to use certain features of the res.redirect func, such as res.redirect('back') or res.redirect('..')

    if (this.pathOverride) {
      return this.pathOverride;
    }

    return `${this.getProtocolAndHostnameUrlString()}${this.mutatedRequestData.path}${this.getQueryStringUrlString()}`;
  }

  concatFullUrl({
    protocol, hostname, path, queryString,
  }) {
    return `${protocol}://${hostname}${path}${queryString.length > 0 ? `?${queryString}` : queryString}`;
  }

  // Checking to see if either protocol or host have changed, as not to always pass in a full URL, to not break Express redirect arg logic

  getProtocolAndHostnameUrlString() {
    const protocolDiffers = this.originalRequestData.protocol !== this.mutatedRequestData.protocol;
    const hostnameDiffers = this.originalRequestData.hostname !== this.mutatedRequestData.hostname;

    if (protocolDiffers) {
      return `${this.mutatedRequestData.protocol}://${this.mutatedRequestData.hostname}`;
    }

    if (hostnameDiffers) {
      return this.mutatedRequestData.hostname;
    }

    return blankString;
  }

  // If it is blank, do not concat the ?

  getQueryStringUrlString() {
    return this.mutatedRequestData.queryString === blankString
      ? blankString
      : `?${this.mutatedRequestData.queryString}`;
  }

  // These setter methods are used to control the redirect if a function has been passed in for custom redirect logic

  setMethod(method) {
    validator.validateIsString(method);

    this.mutatedRequestData.method = method;

    return this;
  }

  setProtocol(protocol) {
    validator.validateIsString(protocol);

    this.mutatedRequestData.protocol = protocol;

    return this;
  }

  setHostname(hostname) {
    validator.validateIsString(hostname);

    this.mutatedRequestData.hostname = hostname;

    return this;
  }

  setPath(path) {
    validator.validateIsString(path);

    this.mutatedRequestData.path = path;

    return this;
  }

  setQueryString(queryString) {
    validator.validateIsString(queryString);

    this.mutatedRequestData.queryString = queryString;

    return this;
  }

  // Used to decide in custom redirect logic function whether or not to persist the query string

  setPersistQueryString(bool) {
    validator.validateIsBoolean(bool);

    this.config.persistQueryString(bool);

    return this;
  }

  // Used to change code in custom redirect logic function

  setRedirectType(code) {
    validator.validateRedirectCode(code);

    this.config.redirectType = code;

    return this;
  }

  // pathOverride is used to provide an interface to use certain features of the res.redirect func, such as res.redirect('back') or res.redirect('..')

  setPathOverride(path) {
    validator.validateIsString(path);

    this.pathOverride = path;

    return this;
  }

  // Used to get the mutated values inside the function with custom redirects

  get method() {
    return this.mutatedRequestData.method;
  }

  get protocol() {
    return this.mutatedRequestData.protocol;
  }

  get hostname() {
    return this.mutatedRequestData.hostname;
  }

  get path() {
    return this.mutatedRequestData.path;
  }

  get queryString() {
    return this.mutatedRequestData.queryString;
  }

  get redirectType() {
    return this.config.redirectType;
  }

  get requiresRedirect() {
    return this.concatFullUrl(this.originalRequestData) !== this.concatFullUrl(this.mutatedRequestData) || Boolean(this.pathOverride);
  }
}

module.exports = CleanRedirect;
