const {
  protocol,
  hostname,
  path,
  queryString,
  hash,
} = require('./trump-got-trumped.mock');

const {
  blankString,
  slash,
  hashSymbol,
  querySymbol,
} = require('./constants.mock');

module.exports = {
  instantiation: {
    withQueryWithHash: {
      mock: {
        protocol,
        hostname,
        uri: `${path}${queryString}${hash}`,
      },
      result: {
        protocol,
        hostname,
        path,
        queryString,
        hash,
        uri: `${path}${queryString}${hash}`,
        url: `${protocol}://${hostname}${path}${queryString}${hash}`,
      },
    },
    withQueryNoHash: {
      mock: {
        protocol,
        hostname,
        uri: `${path}${queryString}`,
      },
      result: {
        protocol,
        hostname,
        path,
        queryString,
        hash: blankString,
        uri: `${path}${queryString}`,
        url: `${protocol}://${hostname}${path}${queryString}`,
      },
    },
    noQueryWithHash: {
      mock: {
        protocol,
        hostname,
        uri: `${path}${hash}`,
      },
      result: {
        protocol,
        hostname,
        path,
        queryString: blankString,
        hash,
        uri: `${path}${hash}`,
        url: `${protocol}://${hostname}${path}${hash}`,
      },
    },
    noQueryNoHash: {
      mock: {
        protocol,
        hostname,
        uri: `${path}`,
      },
      result: {
        protocol,
        hostname,
        path,
        queryString: blankString,
        hash: blankString,
        uri: `${path}`,
        url: `${protocol}://${hostname}${path}`,
      },
    },
    withQueryWithHashIsRoot: {
      mock: {
        protocol,
        hostname,
        uri: `${slash}${queryString}${hash}`,
      },
      result: {
        protocol,
        hostname,
        path: slash,
        queryString,
        hash,
        uri: `${slash}${queryString}${hash}`,
        url: `${protocol}://${hostname}${slash}${queryString}${hash}`,
      },
    },
    withEmptyQueryWithEmptyHashIsRoot: {
      mock: {
        protocol,
        hostname,
        uri: `${slash}${querySymbol}${hashSymbol}`,
      },
      result: {
        protocol,
        hostname,
        path: slash,
        queryString: querySymbol,
        hash: hashSymbol,
        uri: `${slash}${querySymbol}${hashSymbol}`,
        url: `${protocol}://${hostname}${slash}${querySymbol}${hashSymbol}`,
      },
    },
  },
};
