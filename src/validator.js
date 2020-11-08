const CleanRedirectError = require('./clean-redirect-error');

const validateRedirectCode = (code) => {
  const validRedirectCodes = [301, 302];

  if (!validRedirectCodes.includes(code)) {
    throw new CleanRedirectError('Option \'redirectType\' must have an integer value of either 301 or 302.');
  }
};

const validateConfig = ({ redirectType, toWww, toNaked }) => {
  validateRedirectCode(redirectType);

  if (toWww && toNaked) {
    throw new CleanRedirectError('Both \'toWww\' and \'toNaked\' cannot be simultaneously set to true.');
  }
};

const validateRequestData = (requestData) => {
  Object.keys(requestData).forEach((key) => {
    const value = requestData[key];

    if (value === 'undefined') {
      throw new CleanRedirectError(`Missing a value for request property '${key}'.`);
    }

    if (typeof value !== 'string') {
      throw new CleanRedirectError(`Expected a value of type 'string' for request property ${key}. Instead received type ${typeof value}.`);
    }
  });
};

const validateIsString = (string) => {
  if (typeof string !== 'string') {
    throw new CleanRedirectError(`Expected a value of type 'string'. Instead received type ${typeof string}.`);
  }
};

const validateIsBoolean = (bool) => {
  if (typeof bool !== 'boolean') {
    throw new CleanRedirectError(`Expected a value of type 'boolean'. Instead received type ${typeof bool}.`);
  }
};

const validateCustomRedirects = (customRedirects) => {
  if (customRedirects && typeof customRedirects !== 'function') {
    throw new CleanRedirectError('When set, the option \'customRedirects\' must either a function.');
  }
};

module.exports = {
  validateConfig,
  validateRequestData,
  validateIsString,
  validateRedirectCode,
  validateIsBoolean,
  validateCustomRedirects,
};
