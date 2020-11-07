const helper = require('./helper');
const validator = require('./validator');

class CleanRedirect {
  constructor(requestData, config) {
    this.originalRequestData = {
      method: requestData.method,
      protocol: requestData.protocol,
      hostname: requestData.hostname,
      path: helper.parsePath(requestData.originalUrl),
      queryString: helper.parseQueryString(requestData.originalUrl),
    };

    validator.validateRequestData(requestData);
    Object.freeze(this.originalRequestData);

    this.config = {
      forceHttps: config.forceHttps || false,
      toWww: config.toWww || false,
      toNaked: config.toNaked || false,
      toLowerCase: config.toLowerCase || false,
      removeTrailingSlash: config.removeTrailingSlash || false,
      removeQueryString: config.removeQueryString || false,
      redirectType: config.redirectType || null,
    };

    validator.validateConfig(this.config);
    Object.freeze(this.config);

    this.mutatedRequestData = {
      method: this.originalRequestData.method,
      protocol: helper.mutateProtocol(this.originalRequestData.protocol, this.config),
      hostname: helper.mutateHostname(this.originalRequestData.hostname, this.config),
      path: helper.mutatePath(this.originalRequestData.path, this.config),
      queryString: helper.mutateQueryString(this.originalRequestData.queryString, this.config),
    };

    validator.validateRequestData(this.mutatedRequestData);
    Object.seal(this.mutatedRequestData);
  }

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

  get originalUrl() {
    return this.concatUrl(this.originalRequestData);
  }

  get redirectUrl() {
    return this.concatUrl(this.mutatedRequestData);
  }

  get requiresRedirect() {
    return this.originalUrl !== this.redirectUrl;
  }

  concatUrl({ protocol, hostname, path, queryString }) {
    return `${protocol}://${hostname}${path}${queryString.length > 0 ? `?${queryString}` : queryString}`;
  }

  getProtocolUrlString() {
    return this.originalRequestData.protocol === this.mutatedRequestData.protocol
      ? ''
      : `${this.mutatedRequestData.protocol}://`;
  }

  getHostnameUrlString() {
    return this.originalRequestData.hostname === this.mutatedRequestData.hostname
      ? ''
      : this.mutatedRequestData.hostname;
  }

  getQueryStringUrlString() {

  }

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
}

module.exports = CleanRedirect;