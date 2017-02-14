const got = require('got');

const URL = 'https://rubygems.org/api/v1/search.json';

module.exports.search = query => (
  got(URL, { json: true, query: { query } })
    .then(response => (
      response.body.map(result => (
        {
          title: result.name,
          value: result.project_uri,
          subtitle: result.info,
        }
      ))
    ))
    .catch((error) => {
      console.error(error.response.body); // eslint-disable-line no-console
    })
);
