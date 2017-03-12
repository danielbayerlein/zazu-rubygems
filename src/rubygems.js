const got = require('got');

const URL = 'https://rubygems.org/api/v1/search.json';

module.exports.search = query => new Promise((resolve, reject) => (
  got(URL, { json: true, query: { query } })
    .then(response => (
      resolve(
        response.body.map(result => (
          {
            title: result.name,
            value: result.project_uri,
            subtitle: result.info,
          }
        )),
      )
    ))
    .catch(error => reject(error))
));
