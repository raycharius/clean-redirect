const validator = require('../src/validator');

describe('Validators – Check that function properly', () => {
  test('validateCleanRedirectConfig', () => {
    expect(() => validator.validateCleanRedirectConfig({ toWww: true, toNaked: true, redirectCode: 301 })).toThrow();
    expect(() => validator.validateCleanRedirectConfig({ toWww: true, toNaked: false, redirectCode: 303 })).toThrow();

    validator.validateCleanRedirectConfig({ toWww: true, toNaked: false, redirectCode: 301 });
  });

  test('validateRedirectCode', () => {
    expect(() => validator.validateRedirectCode(303)).toThrow();
  });

  test('validateCleanRedirectUrlArgs', () => {
    expect(() => validator.validateCleanRedirectUrlArgs({ protocol: undefined, hostname, uri })).toThrow();
    expect(() => validator.validateCleanRedirectUrlArgs({ protocol, hostname: undefined, uri })).toThrow();
    expect(() => validator.validateCleanRedirectUrlArgs({ protocol, hostname, uri: undefined })).toThrow();

    validator.validateCleanRedirectUrlArgs({ protocol: 'http', hostname: 'gobiden.com', uri: '/make/democracy/great/again' });
  });

  test('validateBooleanCleanRedirectConfigOptions', () => {
    expect(() => validator.validateBooleanCleanRedirectConfigOptions({ toWww: false, forceHttps: 'no' })).toThrow();
    expect(() => validator.validateBooleanCleanRedirectConfigOptions({ toWww: false, forceHttps: 'no' })).toThrow();

    validator.validateBooleanCleanRedirectConfigOptions({ toWww: false, forceHttps: true });
  });

  test('validateIsString', () => {
    expect(() => validator.validateIsString(301)).toThrow();

    validator.validateIsString('hello');
  });

  test('validateIsBoolean', () => {
    expect(() => validator.validateIsBoolean('hello')).toThrow();

    validator.validateIsBoolean(true);
  });

  test('validateCustomRedirects', () => {
    expect(() => validator.validateCustomRedirects('hello')).toThrow();

    validator.validateCustomRedirects(() => true);
  });
});