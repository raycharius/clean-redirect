const validator = require('./validator');
const {
  questionMark,
  hash,
  blankString,
  slashString,
  props,
} = require('./constants');

class CleanRedirectUrl {
  constructor({ protocol, hostname, uri }) {
    this.protocol = protocol;
    this.hostname = hostname;
    this.uri = uri;
    this.path = this.parsePath();
    this.queryString = this.parseQueryString();
    this.hash = this.parseHash();
    this.url = this.getFullPath();
  }

  parsePath() {
    const startQueryStringIndex = this.uri.indexOf(questionMark);
    const startHashIndex = this.uri.indexOf(hash);
    const hasQueryString = startQueryStringIndex >= 0;
    const hasSlash = startHashIndex >= 0;

    if (hasQueryString) {
      return this.uri.split(questionMark).shift();
    }

    return hasSlash ? this.uri.split(hash).shift() : this.uri;
  }

  parseQueryString() {
    const startQueryStringIndex = this.uri.indexOf(questionMark);
    const startHashIndex = this.uri.indexOf(hash);
    const hasQueryString = startQueryStringIndex >= 0;
    const hasSlash = startHashIndex >= 0;

    if (hasQueryString && hasSlash) {
      return this.uri.slice(startQueryStringIndex, startHashIndex);
    }

    return !hasSlash ? this.uri.slice(startQueryStringIndex) : blankString;
  }

  /**
   * @private
   */

  parseHash() {
    const startHashIndex = this.uri.indexOf(hash);
    const hasSlash = startHashIndex >= 0;

    return hasSlash ? this.uri.slice(startHashIndex) : blankString;
  }

  /**
   * @private
   */

  concatUri() {
    return `${this.path}${this.queryString}${this.hash.length}`;
  }

  getFullPath(config = {}) {
    const {
      includeProtocol = true,
      includeHostname = true,
      includeQueryString = true,
      includeHash = true,
    } = config;
    const urlParts = [];

    if (includeProtocol) {
      urlParts.push(this.protocol, slashString);
    }

    if (includeHostname || includeProtocol) {
      urlParts.push(this.hostname);
    }

    urlParts.push(this.path);

    if (includeQueryString) {
      urlParts.push(this.queryString);
    }

    if (includeHash) {
      urlParts.push(this.hash);
    }

    return urlParts.join('');
  }

  setProtocol(string) {
    return this.setProperty(props.protocol, string);
  }

  setHostname(string) {
    return this.setProperty(props.hostname, string);
  }

  setPath(string) {
    return this.setProperty(props.path, string);
  }

  setQueryString(string) {
    return this.setProperty(props.queryString, string);
  }

  setHash(string) {
    return this.setProperty(props.hash, string);
  }

  /**
   * @private
   */

  setProperty(property, value) {
    validator.validateIsString(value);

    this[property] = value;

    this.url = this.getFullPath();
    this.uri = this.concatUri();

    return this;
  }
}

module.exports = CleanRedirectUrl;
