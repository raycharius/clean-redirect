const parsePath = (originalUrl) => originalUrl.split("?").shift();

const parseQueryString = (originalUrl) => {
  const startQueryIndex = originalUrl.indexOf('?');

  return (startQueryIndex >= 0) ? originalUrl.slice(startQueryIndex + 1) : '';
};

const mutateProtocol = (protocol, { forceHttps }) => forceHttps ? 'https' : protocol;

const mutateHostname = (hostname, { toWww, toNaked }) => {
  if (toWww) {
    return hostname.startsWith('www') ? hostname : `www.${hostname}`;
  }

  if (toNaked) {
    const startWwwIndex = hostname.indexOf('www.');

    return (startWwwIndex >= 0) ? hostname.slice(4) : hostname;
  }

  return hostname;
};

const mutatePath = (path, { toLowerCase, removeTrailingSlash }) => {
  const slash = '/';
  const mutatedPath = toLowerCase ? path.toLowerCase() : path;
  const pathLength = mutatedPath.length;
  const hasTrailingSlash = mutatedPath.charAt(pathLength - 1) === slash;

  if (removeTrailingSlash && hasTrailingSlash && mutatedPath !== slash) {
    return mutatedPath.slice(0, mutatedPath.length - 1);
  }

  return mutatedPath;
};

const mutateQueryString = (queryString, { removeQueryString }) => removeQueryString ? '' : queryString;

module.exports = {
  parsePath,
  parseQueryString,
  mutateProtocol,
  mutateHostname,
  mutatePath,
  mutateQueryString,
};