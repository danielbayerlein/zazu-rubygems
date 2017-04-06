const got = require('got');
const CacheConf = require('cache-conf');

const URL = 'https://rubygems.org/api/v1/search.json';

const CACHE_CONF = {
  key: 'zazu-rubygems', // cache key prefix
  maxAge: 3600000, // 1 hour
};

const cache = new CacheConf();

/**
 * Fetch the URL, cache the result and return it.
 * Returns the cache result if it is valid.
 *
 * @param  {string}  query Search query
 * @return {Promise}       Returns a promise that is fulfilled with the JSON result
 */
module.exports.search = (query) => {
  const cacheKey = `${CACHE_CONF.key}.${query}`;
  const cachedResponse = cache.get(cacheKey, { ignoreMaxAge: true });

  if (cachedResponse && !cache.isExpired(cacheKey)) {
    return Promise.resolve(cachedResponse);
  }

  return new Promise((resolve, reject) => (
    got(URL, { json: true, query: { query } })
      .then((response) => {
        const data = response.body.map(result => ({
          id: result.name,
          title: result.name,
          value: result.project_uri,
          subtitle: result.info,
        }));

        cache.set(cacheKey, data, { maxAge: CACHE_CONF.maxAge });

        resolve(data);
      })
      .catch((err) => {
        if (cachedResponse) {
          resolve(cachedResponse);
        }

        reject(err);
      })
  ));
};
