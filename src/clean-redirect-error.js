class CleanRedirectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CleanRedirectError';
  }
}

module.exports = CleanRedirectError;
