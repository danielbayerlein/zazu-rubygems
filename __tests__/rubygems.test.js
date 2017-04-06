/* eslint global-require: 0 */

describe('rubygems.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let rubygems;
    let cache;

    const result = require('../__mocks__/result.json')[0];
    const mockResult = [{
      id: result.name,
      title: result.name,
      value: result.project_uri,
      subtitle: result.info,
    }];

    beforeEach(() => {
      jest.mock('got');
      got = require('got');

      jest.mock('cache-conf');
      cache = { get: jest.fn(), isExpired: jest.fn(), set: jest.fn() };
      require('cache-conf').mockImplementation(() => cache);

      rubygems = require('../src/rubygems');

      got.mockImplementation(() => new Promise(resolve => resolve({
        body: require('../__mocks__/result.json'),
      })));
    });

    test('call got with url and options', () => (
      rubygems.search('middleman-google-analytics')
        .then(() => {
          expect(got).toHaveBeenCalledWith(
            'https://rubygems.org/api/v1/search.json',
            {
              json: true,
              query: {
                query: 'middleman-google-analytics',
              },
            },
          );
        })
    ));

    test('returns an array', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages).toBeInstanceOf(Array);
        })
      ));

    test('returns the expected id', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].id).toBe(mockResult[0].id);
        })
      ));

    test('returns the expected title', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].title).toBe(mockResult[0].title);
        })
      ));

    test('returns the expected value', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].value).toBe(mockResult[0].value);
        })
      ));

    test('returns the expected subtitle', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].subtitle).toBe(mockResult[0].subtitle);
        })
    ));

    test('returns the expected error', () => {
      got.mockImplementation(() => new Promise((resolve, reject) => reject({
        response: {
          body: "Request is missing param 'query'",
        },
      })));

      return rubygems.search('middleman-google-analytics')
        .catch((err) => {
          expect(err.response.body).toBe("Request is missing param 'query'");
        });
    });

    test('call cache.get with the expected arguments', () => (
      rubygems.search('middleman-google-analytics')
        .then(() => {
          expect(cache.get).toBeCalledWith(
            'zazu-rubygems.middleman-google-analytics',
            { ignoreMaxAge: true },
          );
        })
    ));

    test('call cache.set with the expected arguments', () => (
      rubygems.search('middleman-google-analytics')
        .then(() => {
          expect(cache.set).toBeCalledWith(
            'zazu-rubygems.middleman-google-analytics',
            mockResult,
            { maxAge: 3600000 },
          );
        })
    ));

    test('call cache.isExpired with the expected argument', () => {
      cache.get = jest.fn(() => mockResult);

      return rubygems.search('middleman-google-analytics')
        .then(() => {
          expect(cache.isExpired).toBeCalledWith('zazu-rubygems.middleman-google-analytics');
        });
    });

    test('returns the cache result', () => {
      cache.isExpired = jest.fn(() => false);
      cache.get = jest.fn(() => mockResult);

      return rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages).toEqual(mockResult);
        });
    });

    test('returns the cache result when an error occurs', () => {
      cache.isExpired = jest.fn(() => true);
      cache.get = jest.fn(() => mockResult);
      got.mockImplementation(() => new Promise((resolve, reject) => reject()));

      return rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages).toEqual(mockResult);
        });
    });
  });

  describe('integration', () => {
    jest.mock('cache-conf');

    const rubygems = require('../src/rubygems');
    const searchResult = rubygems.search('middleman-google-analytics');

    test('returns an array', () => (
      searchResult.then((packages) => {
        expect(packages).toBeInstanceOf(Array);
      })
    ));

    test('returns an object with a id', () => (
      searchResult.then((packages) => {
        expect(packages[0].id).toBeDefined();
      })
    ));

    test('returns an object with a title', () => (
      searchResult.then((packages) => {
        expect(packages[0].title).toBeDefined();
      })
    ));

    test('returns an object with a value', () => (
      searchResult.then((packages) => {
        expect(packages[0].value).toBeDefined();
      })
    ));

    test('returns an object with a subtitle', () => (
      searchResult.then((packages) => {
        expect(packages[0].subtitle).toBeDefined();
      })
    ));
  });
});
