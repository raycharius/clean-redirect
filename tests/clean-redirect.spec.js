const CleanRedirect = require('../src/clean-redirect');
const CleanRedirectUrl = require('../src/clean-redirect-url');
const {
  protocol,
  hostname,
  path,
  queryString,
  hash,
  uri,
  url,
  hostnameNoWww,
  uriTrailingSlash,
  uriUpperCase,
  uriUpperCaseTrailingSlash,
} = require('./mocks/clean-redirect.mock');

describe('CleanRedirect – Instantiation works correctly', () => {
  test('Instantiation is successful, and sourceUrl and targetUrl are instances of CleanRedirectUrl, and sourceUrl values are valid', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    expect(cleanRedirect.sourceUrl).toBeInstanceOf(CleanRedirectUrl);
    expect(cleanRedirect.targetUrl).toBeInstanceOf(CleanRedirectUrl);
    expect(cleanRedirect.sourceUrl).toEqual(cleanRedirect.targetUrl);
    expect(cleanRedirect.sourceUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.sourceUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.sourceUrl.path).toEqual(path);
    expect(cleanRedirect.sourceUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.sourceUrl.uri).toEqual(uri);
    expect(cleanRedirect.sourceUrl.url).toEqual(url);
  });

  test('Instantiation results in pathOverride having value of null', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    expect(cleanRedirect.pathOverride).toEqual(null);
  });

  test('Instantiation with no options sets all options to false, with redirect type of 302', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    expect(cleanRedirect.config.forceHttps).toEqual(false);
    expect(cleanRedirect.config.toWww).toEqual(false);
    expect(cleanRedirect.config.toNaked).toEqual(false);
    expect(cleanRedirect.config.pathToLowerCase).toEqual(false);
    expect(cleanRedirect.config.removeTrailingSlash).toEqual(false);
    expect(cleanRedirect.config.persistQueryString).toEqual(false);
    expect(cleanRedirect.config.alwaysPassFullUrl).toEqual(false);
    expect(cleanRedirect.config.redirectType).toEqual(302);
  });

  test('Instantiation with all options set to false sets options to false, with redirect type of 302', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, {
      forceHttps: false,
      toWww: false,
      toNaked: false,
      pathToLowerCase: false,
      removeTrailingSlash: false,
      persistQueryString: false,
      alwaysPassFullUrl: false,
    });

    expect(cleanRedirect.config.forceHttps).toEqual(false);
    expect(cleanRedirect.config.toWww).toEqual(false);
    expect(cleanRedirect.config.toNaked).toEqual(false);
    expect(cleanRedirect.config.pathToLowerCase).toEqual(false);
    expect(cleanRedirect.config.removeTrailingSlash).toEqual(false);
    expect(cleanRedirect.config.persistQueryString).toEqual(false);
    expect(cleanRedirect.config.alwaysPassFullUrl).toEqual(false);
    expect(cleanRedirect.config.redirectType).toEqual(302);
  });

  test('Instantiation with all options set to true sets options to true (except toWww), with redirect type of 302', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, {
      forceHttps: true,
      toWww: false,
      toNaked: true,
      pathToLowerCase: true,
      removeTrailingSlash: true,
      persistQueryString: true,
      alwaysPassFullUrl: true,
    });

    expect(cleanRedirect.config.forceHttps).toEqual(true);
    expect(cleanRedirect.config.toWww).toEqual(false);
    expect(cleanRedirect.config.toNaked).toEqual(true);
    expect(cleanRedirect.config.pathToLowerCase).toEqual(true);
    expect(cleanRedirect.config.removeTrailingSlash).toEqual(true);
    expect(cleanRedirect.config.persistQueryString).toEqual(true);
    expect(cleanRedirect.config.alwaysPassFullUrl).toEqual(true);
    expect(cleanRedirect.config.redirectType).toEqual(302);
  });

  test('Instantiation with toWww set to true results in a value of true', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { toWww: true });

    expect(cleanRedirect.config.toWww).toEqual(true);
  });

  test('Instantiation with both toWww and toNaked as true throw an error', () => {
    expect(() => new CleanRedirect({ protocol, hostname, uri }, { toNaked: true, toWww: true })).toThrow();
  });

  test('Instantiation with non-boolean value to config throws an error', () => {
    expect(() => new CleanRedirect({ protocol, hostname, uri }, { toNaked: 'invalid' })).toThrow();
  });

  test('Instantiation with redirectType set to 302 results in a 302 redirectType', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { redirectType: 302 });

    expect(cleanRedirect.config.redirectType).toEqual(302);
  });

  test('Instantiation with redirectType set to 301 results in a 301 redirectType', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { redirectType: 301 });

    expect(cleanRedirect.config.redirectType).toEqual(301);
  });

  test('Instantiation with redirectType set to something other than 301 or 302 results in an error being thrown', () => {
    expect(() => new CleanRedirect({ protocol, hostname, uri }, { redirectType: 'invalid' })).toThrow();
  });
});

describe('CleanRedirect – Parsers work correctly based on passed options', () => {
  test('With all options set to false, no values are mutated', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(url);
  });

  test('With forceHttps set to true, a protocol value of http is mutated into https, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol: 'http', hostname, uri }, { forceHttps: true });
    const expectedUrl = `https://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = `https://${hostname}${path}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual('https');
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With toWww set to true, a hostname value starting without www. is mutated into hostname with www, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname: hostnameNoWww, uri }, { toWww: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = `${hostname}${path}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With toNaked set to true, a hostname value starting with www. is mutated into hostname without www, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { toNaked: true });
    const expectedUrl = `${protocol}://${hostnameNoWww}${path}${queryString}`;
    const expectedRedirectUrl = `${hostnameNoWww}${path}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostnameNoWww);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With removeTrailingSlash set to true, a path with a trailing slash is mutated into path without one, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriTrailingSlash }, { removeTrailingSlash: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = path;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With pathToLowerCase set to true, a path with a upper case letters is mutated into path without them, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriUpperCase }, { pathToLowerCase: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = path;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With pathToLowerCase and removeTrailingSlash set to true, the path is lower case, without trailing slash, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriUpperCaseTrailingSlash }, { removeTrailingSlash: true, pathToLowerCase: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = path;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With persistQueryString set to true and toLowerCase, the path is lower case, query string is available in redirect URL, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriUpperCase }, { persistQueryString: true, pathToLowerCase: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = `${path}${queryString}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With alwaysPassFullUrl set to true and toLowerCase, the path is lower case, URL is full, without query string, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriUpperCase }, { alwaysPassFullUrl: true, pathToLowerCase: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = `${protocol}://${hostname}${path}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('With alwaysPassFullUrl, toLowerCase, persistQueryString, the path is lower case, URL is full, with query string, redirect is necessary, etc.', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri: uriUpperCase }, { alwaysPassFullUrl: true, pathToLowerCase: true, persistQueryString: true });
    const expectedUrl = `${protocol}://${hostname}${path}${queryString}`;
    const expectedRedirectUrl = `${protocol}://${hostname}${path}${queryString}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual(protocol);
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostname);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedRedirectUrl);
  });

  test('All URL settings set to true should result in correct path', () => {
    const cleanRedirect = new CleanRedirect({ protocol: 'http', hostname, uri: uriUpperCaseTrailingSlash }, {
      forceHttps: true,
      toNaked: true,
      pathToLowerCase: true,
      removeTrailingSlash: true,
      persistQueryString: true,
    });
    const expectedUrl = `https://${hostnameNoWww}${path}${queryString}`;

    expect(cleanRedirect.targetUrl.protocol).toEqual('https');
    expect(cleanRedirect.targetUrl.hostname).toEqual(hostnameNoWww);
    expect(cleanRedirect.targetUrl.path).toEqual(path);
    expect(cleanRedirect.targetUrl.queryString).toEqual(queryString);
    expect(cleanRedirect.targetUrl.uri).toEqual(uri);
    expect(cleanRedirect.targetUrl.url).toEqual(expectedUrl);
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual(expectedUrl);
  });
});

describe('CleanRedirect – Getter methods work correctly', () => {
  test('Getters retrieve the values of the targetUrl object', () => {
    const cleanRedirect = new CleanRedirect({ protocol: 'http', hostname, uri: uriUpperCaseTrailingSlash }, {
      forceHttps: true,
      toNaked: true,
      pathToLowerCase: true,
      removeTrailingSlash: true,
      persistQueryString: true,
    });

    cleanRedirect.setHash(hash);

    expect(cleanRedirect.protocol).toEqual(cleanRedirect.targetUrl.protocol);
    expect(cleanRedirect.hostname).toEqual(cleanRedirect.targetUrl.hostname);
    expect(cleanRedirect.path).toEqual(cleanRedirect.targetUrl.path);
    expect(cleanRedirect.queryString).toEqual(cleanRedirect.targetUrl.queryString);
    expect(cleanRedirect.hash).toEqual(cleanRedirect.targetUrl.hash);

  });

  test('Getter for redirect type returns redirect type in config object', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { redirectType: 302 });

    expect(cleanRedirect.redirectType).toEqual(302);
    expect(cleanRedirect.redirectType).toEqual(cleanRedirect.config.redirectType);
  });
});

describe('CleanRedirect – Setter methods work correctly', () => {
  test('Setters for URL parts set the values of the targetUrl object', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri }, { persistQueryString: true });

    cleanRedirect.setProtocol('voting');

    expect(cleanRedirect.targetUrl.protocol).toEqual('voting');

    cleanRedirect.setHostname('usa-elections.com');

    expect(cleanRedirect.targetUrl.hostname).toEqual('usa-elections.com');

    cleanRedirect.setPath('/the/path/to/redemption');

    expect(cleanRedirect.targetUrl.path).toEqual('/the/path/to/redemption');

    cleanRedirect.setQueryString('?year=2020');

    expect(cleanRedirect.targetUrl.queryString).toEqual('?year=2020');

    cleanRedirect.setHash('#goamerica');

    expect(cleanRedirect.targetUrl.hash).toEqual('#goamerica');

    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual('voting://usa-elections.com/the/path/to/redemption?year=2020#goamerica');
  });

  test('Setters for config object set the values correctly', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    cleanRedirect.setPersistQueryString(true);

    expect(cleanRedirect.config.persistQueryString).toEqual(true);

    cleanRedirect.setRedirectType(301);

    expect(cleanRedirect.config.redirectType).toEqual(301);

    cleanRedirect.setPathOverride('..');

    expect(cleanRedirect.pathOverride).toEqual('..');
  });

  test('Once set, pathOverride is returned by the getRedirectUrl method', () => {
    const cleanRedirect = new CleanRedirect({ protocol, hostname, uri });

    cleanRedirect.setPathOverride('..');

    expect(cleanRedirect.pathOverride).toEqual('..');
    expect(cleanRedirect.requiresRedirect()).toEqual(true);
    expect(cleanRedirect.getRedirectUrl()).toEqual('..');
  });
});
