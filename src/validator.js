const validateConfig = ({ redirectType, toWww, toNaked }) => {
  const supportedRedirects = [301, 302];

  if (!supportedRedirects.includes(redirectType)) {
    throw new Error(`Option 'redirectType' must have an integer value of either 301 or 302.`);
  }

  if (toWww && toNaked) {
    throw new Error(`Both 'toWww' and 'toNaked' cannot be simultaneously set to true.`);
  }
};

const validateRequestData = (requestData) => {
  Object.keys(requestData).forEach((key) => {
    const value = requestData[key];

    if (value === 'undefined') {
      throw new Error(`Missing a value for request property '${key}'.`);
    }

    if (typeof value !== 'string') {
      throw new Error(`Expected a value of type 'string' for request property ${key}. Instead received type ${typeof value}.`);
    }
  });
};

const validateIsString = (string) => {
  if (typeof string !== 'string') {
    throw new Error(`Expected a value of type 'string'. Instead received type ${typeof string}.`);
  }
}

module.exports = {
  validateConfig,
  validateRequestData,
  validateIsString,
};
