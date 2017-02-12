const got = require('got');

const API_VERSION = 1;
const GOT_OPTIONS = { json: true };

const searchUrl = query => (
  `https://rubygems.org/api/v${API_VERSION}/search.json?query=${query}`
);

module.exports.search = query => (
  got(searchUrl(query), GOT_OPTIONS)
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
