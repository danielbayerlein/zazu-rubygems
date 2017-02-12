const index = require('../src/');
const rubygems = require('../src/rubygems');

describe('index.js', () => {
  beforeEach(() => {
    rubygems.search = jest.fn();
    index()('rails');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('called rubygems.search with zazu', () => {
    expect(rubygems.search).toBeCalledWith('rails');
  });
});
