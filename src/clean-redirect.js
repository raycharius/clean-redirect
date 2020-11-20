const CleanRedirectUrl = require('./clean-redirect-url');
const validator = require('./validator');
const {
  www,
  slash,
  https,
  props,
} = require('./constants');

class CleanRedirect {
  constructor(urlData, config = {}) {
    this.config = {
      forceHttps: config.forceHttps || false,
      toWww: config.toWww || false,
      toNaked: config.toNaked || false,
      pathToLowerCase: config.pathToLowerCase || false,
      removeTrailingSlash: config.removeTrailingSlash || false,
      persistQueryString: config.persistQueryString || false,
      alwaysPassFullUrl: config.alwaysPassFullUrl || false,
      redirectCode: config.redirectCode || 302,
    };

    validator.validateCleanRedirectConfig(this.config);

    this.sourceUrl = new CleanRedirectUrl(urlData);

    this.targetUrl = new CleanRedirectUrl(urlData)
      .setProtocol(this.config.forceHttps ? https : this.sourceUrl.protocol)
      .setHostname(this.getTargetHostname())
      .setPath(this.getTargetPath());

    this.pathOverride = null;
  }

  /**
   * @private
   */

  getTargetHostname() {
    const hasWww = this.sourceUrl.hostname.startsWith(www);

    if (this.config.toWww && !hasWww) {
      return `${www}${this.sourceUrl.hostname}`;
    }

    if (this.config.toNaked && hasWww) {
      return this.sourceUrl.hostname.slice(4);
    }

    return this.sourceUrl.hostname;
  }

  /**
   * @private
   */

  getTargetPath() {
    let targetPath = this.sourceUrl.path;

    const pathLength = targetPath.length;
    const isSlash = targetPath === slash;
    const hasTrailingSlash = targetPath.charAt(pathLength - 1) === slash;

    if (this.config.pathToLowerCase && !isSlash) {
      targetPath = targetPath.toLowerCase();
    }

    if (this.config.removeTrailingSlash && hasTrailingSlash && !isSlash) {
      targetPath = targetPath.slice(0, pathLength - 1);
    }

    return targetPath;
  }

  /**
   * @type {boolean}
   */

  get requiresRedirect() {
    return this.sourceUrl.url !== this.targetUrl.url || Boolean(this.pathOverride);
  }

  /**
   * @type {string}
   */

  get redirectUrl() {
    if (this.pathOverride) {
      return this.pathOverride;
    }

    if (this.config.alwaysPassFullUrl) {
      return this.targetUrl.generateUrl({ includeQueryString: this.config.persistQueryString });
    }

    return this.targetUrl.generateUrl({
      includeProtocol: this.sourceUrl.protocol !== this.targetUrl.protocol,
      includeHostname: this.sourceUrl.hostname !== this.targetUrl.hostname,
      includeQueryString: this.config.persistQueryString,
    });
  }

  /**
   * @type {string}
   */

  get protocol() {
    return this.targetUrl.protocol;
  }

  /**
   * @type {string}
   */

  get hostname() {
    return this.targetUrl.hostname;
  }

  /**
   * @type {string}
   */

  get path() {
    return this.targetUrl.path;
  }

  /**
   * @type {string}
   */

  get queryString() {
    return this.targetUrl.queryString;
  }

  /**
   * @type {string}
   */

  get hash() {
    return this.targetUrl.hash;
  }

  /**
   * @type {number}
   */

  get redirectCode() {
    return this.config.redirectCode;
  }

  /**
   * @param {string} protocol
   * @return {this}
   */

  setProtocol(protocol) {
    this.targetUrl.setProtocol(protocol);

    return this;
  }

  /**
   * @param {string} hostname
   * @return {this}
   */

  setHostname(hostname) {
    this.targetUrl.setHostname(hostname);

    return this;
  }

  /**
   * @param {string} path
   * @return {this}
   */

  setPath(path) {
    this.targetUrl.setPath(path);

    return this;
  }

  /**
   * @param {string} queryString
   * @return {this}
   */

  setQueryString(queryString) {
    this.targetUrl.setQueryString(queryString);

    return this;
  }

  /**
   * @param {string} hash
   * @return {this}
   */

  setHash(hash) {
    this.targetUrl.setHash(hash);

    return this;
  }

  /**
   * @param {string} bool
   * @return {this}
   */

  setPersistQueryString(bool) {
    validator.validateIsBoolean(bool);

    return this.setConfigProperty(props.persistQueryString, bool);
  }

  /**
   * @param {number} code
   * @return {this}
   */

  setRedirectCode(code) {
    validator.validateRedirectCode(code);

    return this.setConfigProperty(props.redirectCode, code);
  }

  /**
   * @param {string} path
   * @return {this}
   */

  setPathOverride(path) {
    validator.validateIsString(path);

    this.pathOverride = path;

    return this;
  }

  /**
   * @private
   */

  setConfigProperty(property, value) {
    this.config[property] = value;

    return this;
  }
}

module.exports = CleanRedirect;
