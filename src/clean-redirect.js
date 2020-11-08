const CleanRedirectUrl = require('./clean-redirect-url');
const validator = require('./validator');
const {
  www,
  slash,
  https,
} = require('./constants');

class CleanRedirect {
  constructor({ method, ...urlData }, config) {
    this.config = {
      forceHttps: config.forceHttps || false,
      toWww: config.toWww || false,
      toNaked: config.toNaked || false,
      toLowerCase: config.toLowerCase || false,
      removeTrailingSlash: config.removeTrailingSlash || false,
      persistQueryString: config.persistQueryString || false,
      persistHash: config.persistHash || false,
      alwaysPassFullUrl: config.alwaysPassFullUrl || false,
      redirectType: config.redirectType || null,
    };

    this.method = method;

    this.sourceUrl = new CleanRedirectUrl(urlData);

    this.targetUrl = new CleanRedirectUrl(urlData)
      .setProtocol(this.getTargetProtocol())
      .setHostname(this.getTargetHostname())
      .setPath(this.getTargetPath());

    this.customRedirects = config.customRedirects || null;

    this.pathOverride = null;

    if (this.customRedirects) {
      this.customRedirects(this);
    }
  }

  /**
   * @private
   */

  getTargetProtocol() {
    return this.config.forceHttps ? https : this.sourceUrl.protocol;
  }

  /**
   * @private
   */

  getTargetHostname() {
    if (this.config.toWww) {
      return this.sourceUrl.hostname.startsWith(www)
        ? this.sourceUrl.hostname
        : `${www}${this.sourceUrl.hostname}`;
    }

    if (this.config.toNaked) {
      const startWwwIndex = this.sourceUrl.hostname.indexOf(www);

      return (startWwwIndex >= 0)
        ? this.sourceUrl.hostname.slice(4)
        : this.sourceUrl.hostname;
    }

    return this.sourceUrl.hostname;
  }

  /**
   * @private
   */

  getTargetPath() {
    const mutatedPath = this.config.toLowerCase
      ? this.sourceUrl.path.toLowerCase()
      : this.sourceUrl.path;
    const pathLength = mutatedPath.length;
    const hasTrailingSlash = mutatedPath.charAt(pathLength - 1) === slash;

    if (this.config.removeTrailingSlash && hasTrailingSlash && mutatedPath !== slash) {
      return mutatedPath.slice(0, mutatedPath.length - 1);
    }

    return mutatedPath;
  }

  requiresRedirect() {
    return this.sourceUrl.url !== this.targetUrl.url || Boolean(this.pathOverride);
  }

  getRedirectUrl() {
    if (this.pathOverride) {
      return this.pathOverride;
    }

    const protocolDiffers = this.sourceUrl.protocol !== this.targetUrl.protocol;
    const hostnameDiffers = this.sourceUrl.hostname !== this.targetUrl.hostname;
    const fullPath = this.targetUrl.getFullPath({
      includeQueryString: this.config.persistQueryString,
      includeHash: this.config.persistHash,
    });

    if (protocolDiffers || this.config.alwaysPassFullUrl) {
      return `${this.targetUrl.protocol}://${this.targetUrl.hostname}${fullPath}`;
    }

    return hostnameDiffers ? `${this.targetUrl.hostname}${fullPath}` : fullPath;
  }

  get protocol() {
    return this.targetUrl.protocol;
  }

  get hostname() {
    return this.targetUrl.hostname;
  }

  get path() {
    return this.targetUrl.path;
  }

  get queryString() {
    return this.targetUrl.queryString;
  }

  get redirectType() {
    return this.config.redirectType;
  }

  setProtocol(protocol) {
    return this.callTargetUrlMethod('setProtocol', protocol);
  }

  setHostname(hostname) {
    return this.callTargetUrlMethod('setHostname', hostname);
  }

  setPath(path) {
    return this.callTargetUrlMethod('setPath', path);
  }

  setQueryString(queryString) {
    return this.callTargetUrlMethod('setQueryString', queryString);
  }

  setHash(hash) {
    return this.callTargetUrlMethod('setHash', hash);
  }

  setPersistQueryString(bool) {
    validator.validateIsBoolean(bool);
    return this.setConfigProperty('persistQuery', bool);
  }

  setPersistHash(bool) {
    validator.validateIsBoolean(bool);
    return this.setConfigProperty('persistHash', bool);
  }

  setRedirectType(code) {
    validator.validateRedirectCode(code);
    return this.setConfigProperty('redirectType', code);
  }

  setPathOverride(path) {
    validator.validateIsString(path);
    return this.setConfigProperty('pathOverride', path);
  }

  /**
   * @private
   */

  setConfigProperty(property, value) {
    this.config[property] = value;

    return this;
  }

  /**
   * @private
   */

  callTargetUrlMethod(method, value) {
    validator.validateIsString(value);
    this.targetUrl[method](value);

    return this;
  }
}

module.exports = CleanRedirect;
