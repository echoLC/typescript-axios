import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptor', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a request interceptor', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test = 'added by interceptor'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('should add a request interceptor that return a new config object', () => {
    const instance = axios.create()

    instance.interceptors.request.use(() => {
      return {
        url: '/foo',
        method: 'post'
      }
    })

    instance('/bar')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
      expect(request.url).toBe('/foo')
    })
  })

  test('should add a request interceptor that return promise', done => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })

    instance('/foo')

    setTimeout(() => {
      getAjaxRequest().then(request => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  test('should add mutiple interceptor', () => {
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.headers.test1 = 'test1'
      return config
    })

    instance.interceptors.request.use(config => {
      config.headers.test2 = 'test2'
      return config
    })

    instance.interceptors.request.use(config => {
      config.headers.test3 = 'test3'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      const { test1, test2, test3 } = request.requestHeaders
      expect(test1).toBe('test1')
      expect(test2).toBe('test2')
      expect(test3).toBe('test3')
    })
  })

  test('should add a response interceptor', done => {
    const instance = axios.create()

    instance.interceptors.response.use(res => {
      res.data = res.data + ' - modified by interceptor'
      return res
    })

    let response: AxiosResponse
    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'response data'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('response data - modified by interceptor')
      done()
    }, 100)
  })

  test('should add a response interceptor that return a new object', done => {
    const instance = axios.create()

    instance.interceptors.response.use(() => {
      return {
        data: 'interceptor return data',
        headers: null,
        status: 500,
        statusText: 'ERR',
        request: null,
        config: {}
      }
    })

    let response: AxiosResponse
    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('interceptor return data')
      expect(response.status).toBe(500)
      expect(response.headers).toBeNull()
      expect(response.statusText).toBe('ERR')
      expect(response.request).toBeNull()
      expect(response.config).toEqual({})
      done()
    }, 100)
  })

  test('should add a response interceptor that return promise', done => {
    const instance = axios.create()

    instance.interceptors.response.use(res => {
      return new Promise(resolve => {
        setTimeout(() => {
          res.data = 'you have been promise'
          resolve(res)
        }, 10)
      })
    })

    let response: AxiosResponse
    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('you have been promise')
      done()
    }, 100)
  })

  test('should add mutiple response interceptor', done => {
    const instance = axios.create()

    instance.interceptors.response.use(res => {
      res.data = res.data + '1'
      return res
    })

    instance.interceptors.response.use(res => {
      res.data = res.data + '2'
      return res
    })

    instance.interceptors.response.use(res => {
      res.data = res.data + '3'
      return res
    })

    let response: AxiosResponse
    instance('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('OK123')
      done()
    }, 100)
  })

  test('should allow remove interceptor', done => {
    const instance = axios.create()
    let reqInterceptorId
    let resInterceptorId
    let response: AxiosResponse

    instance.interceptors.request.use(config => {
      config.headers.test1 = 'test1'
      return config
    })

    reqInterceptorId = instance.interceptors.request.use(config => {
      config.headers.test2 = 'this will be removing'
      return config
    })

    instance.interceptors.response.use(res => {
      res.data = res.data + '1'
      return res
    })

    resInterceptorId = instance.interceptors.response.use(res => {
      res.data = res.data + '2'
      return res
    })

    instance.interceptors.request.eject(reqInterceptorId)
    instance.interceptors.response.eject(resInterceptorId)

    instance('foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      expect(request.requestHeaders.test1).toBe('test1')
      expect(request.requestHeaders.test2).toBeUndefined()
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
    })

    setTimeout(() => {
      expect(response.data).toBe('OK1')
      done()
    }, 100)
  })
})
