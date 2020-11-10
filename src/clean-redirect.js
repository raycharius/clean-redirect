const CleanRedirectUrl = require('./clean-redirect-url');
const validator = require('./validator');
const {
  www,
  slash,
  https,
  props,
} = require('./constants');

class CleanRedirect {
  constructor(urlData, config) {
    this.config = {
      forceHttps: config.forceHttps || false,
      toWww: config.toWww || false,
      toNaked: config.toNaked || false,
      pathToLowerCase: config.pathToLowerCase || false,
      removeTrailingSlash: config.removeTrailingSlash || false,
      persistQueryString: config.persistQueryString || false,
      persistHash: config.persistHash || false,
      alwaysPassFullUrl: config.alwaysPassFullUrl || false,
      redirectType: config.redirectType || null,
    };

    this.sourceUrl = new CleanRedirectUrl(urlData);

    this.targetUrl = new CleanRedirectUrl(urlData)
      .setProtocol(this.config.forceHttps ? https : this.sourceUrl.protocol)
      .setHostname(this.getTargetHostname())
      .setPath(this.getTargetPath());

    this.customRedirects = config.customRedirects || null;

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

  requiresRedirect() {
    return this.sourceUrl.url !== this.targetUrl.url || Boolean(this.pathOverride);
  }

  getRedirectUrl() {
    if (this.pathOverride) {
      return this.pathOverride;
    }

    if (this.config.alwaysPassFullUrl) {
      return this.targetUrl.getFullPath({
        includeQueryString: this.config.persistQueryString,
        includeHash: this.config.persistHash,
      });
    }

    return this.targetUrl.getFullPath({
      includeProtocol: this.sourceUrl.protocol !== this.targetUrl.protocol,
      includeHostname: this.sourceUrl.hostname !== this.targetUrl.hostname,
      includeQueryString: this.config.persistQueryString,
      includeHash: this.config.persistHash,
    });
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
    this.targetUrl.setProtocol(protocol);

    return this;
  }

  setHostname(hostname) {
    this.targetUrl.setHostname(hostname);

    return this;
  }

  setPath(path) {
    this.targetUrl.setPath(path);

    return this;
  }

  setQueryString(queryString) {
    this.targetUrl.setQueryString(queryString);

    return this;
  }

  setHash(hash) {
    this.targetUrl.setHash(hash);

    return this;
  }

  setPersistQueryString(bool) {
    validator.validateIsBoolean(bool);

    return this.setConfigProperty(props.persistQuery, bool);
  }

  setPersistHash(bool) {
    validator.validateIsBoolean(bool);

    return this.setConfigProperty(props.persistHash, bool);
  }

  setRedirectType(code) {
    validator.validateRedirectCode(code);

    return this.setConfigProperty(props.redirectType, code);
  }

  setPathOverride(path) {
    validator.validateIsString(path);

    return this.setConfigProperty(props.pathOverride, path);
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
