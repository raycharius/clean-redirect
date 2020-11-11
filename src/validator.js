const CleanRedirectError = require('./clean-redirect-error');

const validateBooleanCleanRedirectConfigOptions = ({ redirectCode, ...config }) => {
  Object.keys(config).forEach((key) => {
    const value = config[key];

    if (typeof value !== 'boolean') {
      throw new CleanRedirectError(`Expected a value of type 'boolean' for options '${key}'. Instead received type '${typeof typeof value}'`);
    }
  });
};

const validateRedirectCode = (code) => {
  const validRedirectCodes = [301, 302];

  if (!validRedirectCodes.includes(code)) {
    throw new CleanRedirectError('Option \'redirectCode\' must have an integer value of either 301 or 302');
  }
};

const validateCleanRedirectConfig = (config) => {
  validateBooleanCleanRedirectConfigOptions(config);

  if (config.toWww && config.toNaked) {
    throw new CleanRedirectError('Both \'toWww\' and \'toNaked\' cannot be simultaneously set to true.');
  }

  validateRedirectCode(config.redirectCode);
};

const validateCleanRedirectUrlArgs = (urlData) => {
  const keys = ['protocol', 'hostname', 'uri'];

  keys.forEach((key) => {
    const value = urlData[key];

    if (value === 'undefined' || typeof value !== 'string') {
      throw new CleanRedirectError(`CleanRedirectError requires a string value for parameter '${key}', received a value with type '${typeof value}'`);
    }
  });
};

const validateIsString = (string) => {
  if (typeof string !== 'string') {
    throw new CleanRedirectError(`Expected a value of type 'string'. Instead received type '${typeof string}'`);
  }
};

const validateIsBoolean = (bool) => {
  if (typeof bool !== 'boolean') {
    throw new CleanRedirectError(`Expected a value of type 'boolean'. Instead received type '${typeof bool}'`);
  }
};

const validateCustomRedirects = (customRedirects) => {
  if (customRedirects && typeof customRedirects !== 'function') {
    throw new CleanRedirectError('When set, the option \'customRedirects\' must either a function');
  }
};

module.exports = {
  validateCleanRedirectConfig,
  validateIsString,
  validateRedirectCode,
  validateIsBoolean,
  validateCustomRedirects,
  validateCleanRedirectUrlArgs,
  validateBooleanCleanRedirectConfigOptions,
};
