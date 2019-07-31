import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse
} from '../types'
import {
  parseHeaders
} from '../helpers/headers'
import {
  createError
} from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null, 
      url, 
      method = 'get',
      headers, 
      responseType, 
      timeout, 
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    // request属性配置
    configureRequest()

    // request事件监听
    onRequestEvents()

    // request添加headers
    processRequestHeaders()

    // 取消request
    requestCancel()

    request.send(data)

    function configureRequest (): void {
      if (responseType) {
        request.responseType = responseType
      }
  
      if (timeout) {
        request.timeout = timeout
      }
  
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function onRequestEvents (): void {
      request.onreadystatechange = function handleHXRLoad() {
        const isRequestPending = request.readyState !== 4 || request.status === 0
        if (isRequestPending) {
          return
        }
  
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType === 'text' ? request.responseText : request.response
  
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
  
        handleResonpse(response)
      }
  
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
  
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED',
          request))
      }
  
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
  
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processRequestHeaders (): void {
      if ((withCredentials && isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          request.setRequestHeader(xsrfHeaderName, xsrfValue)
        }
      }

      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }
  
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        }
        request.setRequestHeader(name, headers[name])
      })
    }

    function requestCancel (): void {
      if (config.cancelToken) {
        config.cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResonpse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status ${response.status}`, config, null,
          request, response))
      }
    }
  })
}
