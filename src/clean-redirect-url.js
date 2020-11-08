const validator = require('./validator');
const {
  questionMark,
  hashSymbol,
  blankString,
  slashString,
  protocolProp,
  hostnameProp,
  pathProp,
  queryStringProp,
  hashProp,
} = require('./constants');

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
    return this.uri.split(questionMark).shift();
  }

  parseQueryString() {
    const startQueryStringIndex = this.uri.indexOf(questionMark);
    const startHashIndex = this.uri.indexOf(hashSymbol);
    const hasQueryString = startQueryStringIndex >= 0;
    const hasSlash = startHashIndex >= 0;

    if (hasQueryString && hasSlash) {
      return this.uri.slice(startQueryStringIndex + 1, startHashIndex);
    }

    return hasSlash ? this.uri.slice(startQueryStringIndex + 1) : blankString;
  }

  /**
   * @private
   */

  parseHash() {
    const startHashIndex = this.uri.indexOf(hashSymbol);
    const hasSlash = startHashIndex >= 0;

    return hasSlash ? this.uri.slice(startHashIndex + 1) : blankString;
  }

  /**
   * @private
   */

  concatUri() {
    return `${this.path}${this.queryString.length > 0 ? `${questionMark}${this.queryString}` : blankString}${this.hash.length > 0 ? `${hashSymbol}${this.hash}` : blankString}`;
  }

  /**
   * @private
   */

  concatUrl() {
    return `${this.protocol}${slashString}${this.hostname}${this.path}${this.queryString.length > 0 ? `${questionMark}${this.queryString}` : blankString}${this.hash.length > 0 ? `${hashSymbol}${this.hash}` : blankString}`;
  }

  getFullPath({ includeQueryString = true, includeHash = true }) {
    return `${this.path}${this.queryString.length > 0 && includeQueryString ? `${questionMark}${this.queryString}` : blankString}${this.hash.length > 0 && includeHash ? `${hashSymbol}${this.hash}` : blankString}`;
  }

  setProtocol(protocol) {
    return this.setProperty(protocolProp, protocol);
  }

  setHostname(hostname) {
    return this.setProperty(hostnameProp, hostname);
  }

  setPath(path) {
    return this.setProperty(pathProp, path);
  }

  setQueryString(queryString) {
    return this.setProperty(queryStringProp, queryString);
  }

  setHash(hash) {
    return this.setProperty(hashProp, hash);
  }

  /**
   * @private
   */

  setProperty(property, value) {
    validator.validateIsString(value);

    this[property] = value;

    this.url = this.concatUrl();
    this.uri = this.concatUri();

    return this;
  }
}

module.exports = CleanRedirectUrl;
