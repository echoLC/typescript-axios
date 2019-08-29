import axios, { AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'
import { deepMerge } from '../src/helpers/utils'

describe.only('defaults', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  const defaultTransformRequest = (axios.defaults.transformRequest as AxiosTransformer[])[0]
  const defaultTransformResponse = (axios.defaults.transformResponse as AxiosTransformer[])[0]

  test('should transform request json', () => {
    expect(defaultTransformRequest({ foo: 'bar' })).toBe('{"foo":"bar"}')
  })

  test('should do nothing to request string', () => {
    expect(defaultTransformRequest('foo=bar')).toBe('foo=bar')
  })

  test('should tranform response json', () => {
    expect(defaultTransformResponse('{"foo":"bar"}')).toEqual({ foo: 'bar' })
  })

  test('should do nothing to response string', () => {
    expect(defaultTransformResponse('foo=bar')).toBe('foo=bar')
  })

  test('should use global defaults config', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should use modified defaults config', () => {
    axios.defaults.baseURL = 'http://example.com'

    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/foo')
    })
  })

  test('should use request config', () => {
    axios('/foo', {
      baseURL: 'http://example.com'
    })

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/foo')
    })
  })

  test.only('should use default config for custom insatnce', () => {
    const instance = axios.create({
      xsrfCookieName: 'CUSTOM-XSRF-TOKEN',
      xsrfHeaderName: 'X-CUSTOM-XSRF-TOKEN'
    })

    document.cookie = instance.defaults.xsrfCookieName + '=foobar'

    instance.get('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[instance.defaults.xsrfHeaderName!]).toBe('foobar')
      document.cookie =
        instance.defaults.xsrfCookieName +
        '=;expires=' +
        new Date(Date.now() - 86400000).toUTCString()
    })
  })

  test('should use GET headers', () => {
    axios.defaults.headers.get['X-CUSTOM-HEADER'] = 'foo'
    axios.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('foo')
      delete axios.defaults.headers.get['X-CUSTOM-HEADER']
    })
  })

  test('should use POST headers', () => {
    axios.defaults.headers.post['X-CUSTOM-HEADER'] = 'bar'

    axios.post('/foo', {})
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['X-CUSTOM-HEADER']).toBe('bar')
      delete axios.defaults.headers.post['X-CUSTOM-HEADER']
    })
  })

  test('should use header config', () => {
    const instance = axios.create({
      headers: {
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
    })

    instance.get('/foo', {
      headers: {
        'X-FOO-HEADER': 'fooHeaderValue',
        'X-BAR-HEADER': 'barHeaderValue'
      }
    })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders).toEqual(
        deepMerge(axios.defaults.headers.common, axios.defaults.headers.get, {
          'X-COMMON-HEADER': 'commonHeaderValue',
          'X-GET-HEADER': 'getHeaderValue',
          'X-FOO-HEADER': 'fooHeaderValue',
          'X-BAR-HEADER': 'barHeaderValue'
        })
      )
    })
  })

  test('should be used by custom instance if set before instance created', () => {
    axios.defaults.baseURL = 'http://example.com'

    const instance = axios.create()
    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/foo')
      delete axios.defaults.baseURL
    })
  })

  test('should not be used by custom instance if set after instance created', () => {
    const instance = axios.create()
    axios.defaults.baseURL = 'http://example.com'

    instance.get('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })
})
