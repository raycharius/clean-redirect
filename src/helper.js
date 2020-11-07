const parsePath = (originalUrl) => originalUrl.split('?').shift();

const parseQueryString = (originalUrl) => {
  const startQueryIndex = originalUrl.indexOf('?');

  return (startQueryIndex >= 0) ? originalUrl.slice(startQueryIndex + 1) : '';
};

module.exports = {
  parsePath,
  parseQueryString,
};
