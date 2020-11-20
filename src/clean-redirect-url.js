const validator = require('./validator');
const {
  questionMark,
  hash,
  blankString,
  slashString,
  props,
  slash,
} = require('./constants');

class CleanRedirectUrl {
  constructor(urlData) {
    validator.validateCleanRedirectUrlArgs(urlData);
    this.protocol = urlData.protocol;
    this.hostname = urlData.hostname;
    this.uri = urlData.uri;
    this.path = this.parsePath();
    this.queryString = this.parseQueryString();
    this.hash = this.parseHash();
    this.url = this.generateUrl();
  }

  /**
   * @private
   */

  parsePath() {
    const startQueryStringIndex = this.uri.indexOf(questionMark);
    const startHashIndex = this.uri.indexOf(hash);
    const hasQueryString = startQueryStringIndex >= 0;
    const hasHash = startHashIndex >= 0;

    if (hasQueryString) {
      return this.uri.split(questionMark).shift();
    }

    return hasHash ? this.uri.split(hash).shift() : this.uri;
  }

  /**
   * @private
   */

  parseQueryString() {
    const startQueryStringIndex = this.uri.indexOf(questionMark);
    const startHashIndex = this.uri.indexOf(hash);
    const hasQueryString = startQueryStringIndex >= 0;
    const hasHash = startHashIndex >= 0;

    if (!hasQueryString) {
      return blankString;
    }

    return hasHash
      ? this.uri.slice(startQueryStringIndex, startHashIndex)
      : this.uri.slice(startQueryStringIndex);
  }

  /**
   * @private
   */

  parseHash() {
    const startHashIndex = this.uri.indexOf(hash);
    const hasHash = startHashIndex >= 0;

    return hasHash ? this.uri.slice(startHashIndex) : blankString;
  }

  /**
   * @private
   */

  concatUri() {
    return `${this.path}${this.queryString}${this.hash}`;
  }

  generateUrl(config = {}) {
    const {
      includeProtocol = true,
      includeHostname = true,
      includeQueryString = true,
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

    urlParts.push(this.hash);

    return urlParts.join('');
  }

  setProtocol(string) {
    return this.setProperty(props.protocol, string);
  }

  setHostname(string) {
    return this.setProperty(props.hostname, string);
  }

  setPath(string) {
    return this.setProperty(props.path, string === blankString ? slash : string);
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

    this.url = this.generateUrl();
    this.uri = this.concatUri();

    return this;
  }
}

module.exports = CleanRedirectUrl;
