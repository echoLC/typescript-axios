import { buildURL, isAbsoluteURL, combineURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers: url', () => {
  describe('buildURL', () => {
    test('should support null param', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { userid: 123 })).toBe('/foo?userid=123')
    })

    test('should ignore if some param value is null', () => {
      expect(
        buildURL('/foo', {
          userid: 234,
          username: null
        })
      ).toBe('/foo?userid=234')
    })

    test('should ignore if the only param value is null', () => {
      expect(
        buildURL('/foo', {
          userid: null
        })
      ).toBe('/foo')
    })

    test('should support object params', () => {
      expect(
        buildURL('/foo', {
          user: {
            userid: 123
          }
        })
      ).toBe('/foo?user=' + encodeURI(JSON.stringify({ userid: 123 })))
    })

    test('should support date param', () => {
      const date = new Date()
      expect(
        buildURL('/foo', {
          date: date
        })
      ).toBe('/foo?date=' + date.toISOString())
    })

    test('should support array param', () => {
      expect(
        buildURL('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    test('should support special char param', () => {
      expect(
        buildURL('/foo', {
          content: '@$'
        })
      ).toBe('/foo?content=@$')
    })

    test('should support existing params', () => {
      expect(
        buildURL('/foo?userid=123', {
          username: 'lc'
        })
      ).toBe('/foo?userid=123&username=lc')
    })

    test('should correct discard url hash mark', () => {
      expect(
        buildURL('/foo?userid=123#hash', {
          username: 'lc'
        })
      ).toBe('/foo?userid=123&username=lc')
    })

    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })

      const params = { foo: 'bar' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toBeCalledWith(params)
    })

    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('a=1&b=2'))).toBe('/foo?a=1&b=2')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://www.baidu.com/user')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-url://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com')).toBeTruthy()
      expect(isAbsoluteURL('http://127.0.0.1')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://document.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/user')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/api')).toBeFalsy()
      expect(isAbsoluteURL('api')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com/users', '')).toBe('https://api.github.com/users')
    })

    test('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com/users', '/')).toBe('https://api.github.com/users/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different', () => {
      expect(isURLSameOrigin('https://github.com/echoLC')).toBeFalsy()
    })
  })
})
