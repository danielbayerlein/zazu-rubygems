const rubygems = require('./rubygems');

module.exports = () => name => rubygems.search(name);
