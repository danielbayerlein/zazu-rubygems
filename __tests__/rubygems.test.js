describe('rubygems.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let rubygems;

    beforeEach(() => {
      jest.mock('got');
      got = require('got'); // eslint-disable-line global-require
      rubygems = require('../src/rubygems'); // eslint-disable-line global-require

      got.mockImplementation(() => new Promise(resolve => resolve({
        // eslint-disable-next-line global-require
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

    test('returns the expected title', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].title).toBe('middleman-google-analytics');
        })
      ));

    test('returns the expected value', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].value).toBe(
            'https://rubygems.org/gems/middleman-google-analytics',
          );
        })
      ));

    test('returns the expected subtitle', () => (
      rubygems.search('middleman-google-analytics')
        .then((packages) => {
          expect(packages[0].subtitle).toBe(
            'middleman-google-analytics is a Middleman extension that ' +
            'generates Google Analytics tracking code, and keeps your ' +
            'config in config.rb, where it belongs.',
          );
        })
    ));

    test('returns the expected error', () => {
      got.mockImplementation(() => new Promise((resolve, reject) => reject({
        response: {
          body: "Request is missing param 'query'",
        },
      })));

      return rubygems.search('middleman-google-analytics')
        .catch((result) => {
          expect(result.response.body).toBe("Request is missing param 'query'");
        });
    });
  });

  describe('integration', () => {
    // eslint-disable-next-line global-require
    const rubygems = require('../src/rubygems');
    const searchResult = rubygems.search('middleman-google-analytics');

    test('returns an array', () => (
      searchResult.then((packages) => {
        expect(packages).toBeInstanceOf(Array);
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
