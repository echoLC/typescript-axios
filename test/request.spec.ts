import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string as url', () => {
    axios('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', () => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(res => {
      expect(res.config.method).toBe('post')
    })

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on network errors', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((err: AxiosError) => {
      return err
    })

    jasmine.Ajax.uninstall()

    return axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      jasmine.Ajax.install()

      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
    }
  })

  test('should reject when request timeout', done => {
    let error: AxiosError

    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(err => {
      error = err
    })

    getAjaxRequest().then(request => {
      // @ts-ingore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(error instanceof Error).toBeTruthy()
        expect(error.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  })

  test('should reject when validateStatus return false', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((err: AxiosError) => {
      return err
    })

    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)
    }
  })

  test('should resolve when validateStatus return true', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((err: AxiosError) => {
      return err
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })

    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')
    }
  })

  test('should return JSON when request resolved', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: 'lc',
        password: '123456'
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'ok',
        responseText: '{"token":123}'
      })
    })

    setTimeout(() => {
      expect(response.data).toEqual({ token: 123 })
      done()
    }, 100)
  })

  test('should return JSON when rejected', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error": "BAD USERNAME", "code": 1}'
      })
    })

    setTimeout(() => {
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('BAD USERNAME')
      expect(response.data.code).toBe(1)
      done()
    }, 100)
  })

  test('should supply correct response', done => {
    let response: AxiosResponse

    axios.post('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'ok',
        responseText: '{"foo": "bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })

    setTimeout(() => {
      expect(response.data.foo).toBe('bar')
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('ok')
      expect(response.headers['content-type']).toBe('application/json')
      done()
    }, 100)
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    axios.post(
      '/foo',
      {
        prop: 'value'
      },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    )

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })
})
