class CleanRedirectUrl {
  constructor({ protocol, hostname, uri }) {
    this.protocol = protocol;
    this.hostname = hostname;
    this.uri = uri;
    this.path = this.parsePath();
    this.queryString = this.parseQueryString();
    this.hash = this.parseHash();
    this.url = this.concatUrl();
  }

  parsePath() {
    return this.uri.split('?').shift();
  }

  parseQueryString() {
    const startQueryStringIndex = this.uri.indexOf('?');
    const startHashIndex = this.uri.indexOf('#');
    const hasQueryString = startQueryStringIndex >= 0;
    const hasSlash = startHashIndex >= 0;

    if (hasQueryString && hasSlash) {
      return this.uri.slice(startQueryStringIndex + 1, startHashIndex);
    }

    return hasSlash ? this.uri.slice(startQueryStringIndex + 1) : '';
  }

  /**
   * @private
   */

  parseHash() {
    const startHashIndex = this.uri.indexOf('#');
    const hasSlash = startHashIndex >= 0;

    return hasSlash ? this.uri.slice(startHashIndex + 1) : '';
  }

  /**
   * @private
   */

  concatUri() {
    return `${this.path}${this.queryString.length > 0 ? `?${this.queryString}` : ''}${this.hash.length > 0 ? `#${this.hash}` : ''}`;
  }

  /**
   * @private
   */

  concatUrl() {
    return `${this.protocol}://${this.hostname}${this.path}${this.queryString.length > 0 ? `?${this.queryString}` : ''}${this.hash.length > 0 ? `#${this.hash}` : ''}`;
  }

  getFullPath({ includeQueryString = true, includeHash = true }) {
    return `${this.path}${this.queryString.length > 0 && includeQueryString ? `?${this.queryString}` : ''}${this.hash.length > 0 && includeHash ? `#${this.hash}` : ''}`;
  }

  setProtocol(protocol) {
    return this.setProperty('protocol', protocol);
  }

  setHostname(hostname) {
    return this.setProperty('hostname', hostname);
  }

  setPath(path) {
    return this.setProperty('path', path);
  }

  setQueryString(queryString) {
    return this.setProperty('queryString', queryString);
  }

  setHash(hash) {
    return this.setProperty('hash', hash);
  }

  /**
   * @private
   */

  setProperty(property, value) {
    this[property] = value;

    this.url = this.concatUrl();
    this.uri = this.concatUri();

    return this;
  }
}

module.exports = CleanRedirectUrl;
