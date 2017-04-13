const index = require('../../src/')
const rubygems = require('../../src/rubygems')

describe('index.js', () => {
  beforeEach(() => {
    rubygems.search = jest.fn()
    index()('middleman-google-analytics')
  })

  afterEach(() => jest.resetAllMocks())

  test('call rubygems.search with "middleman-google-analytics"', () => {
    expect(rubygems.search).toBeCalledWith('middleman-google-analytics')
  })
})
