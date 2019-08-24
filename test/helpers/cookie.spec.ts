import cookie from '../../src/helpers/cookie'

describe('util: cookie', () => {
  test('should read cookie', () => {
    document.cookie = 'foo=bar'

    expect(cookie.read('foo')).toBe('bar')
  })

  test('should return null if cookie name is not exist', () => {
    document.cookie = 'userid=123'
    expect(cookie.read('username')).toBeNull()
  })
})
