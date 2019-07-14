import {
  AxiosRequestConfig,
  AxiosPromise
} from '../types'
import dispatchRequest from './dispatchRequest'

export default class Axios {
  request (url: any, config ? : any): AxiosPromise {
    if (typeof url === 'string') {
      config = config || {}
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get (url: string, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete (url: string, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  options (url: string, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  head (url: string, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  post(url: string, data ? : any, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put (url: string, data ? : any, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch (url: string, data ? : any, config ? : AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData (method: string, url: string, config ? : AxiosRequestConfig):
    AxiosPromise {
      return this.request(Object.assign(config || {}, {
        method,
        url
      }))
    }

  _requestMethodWithData (method: string, url: string, data ? : any, config ? : AxiosRequestConfig):
    AxiosPromise {
      return this.request (Object.assign(config || {}, {
        method,
        url,
        data
      }))
    }
}
