import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  
  xsrfHeaderName: 'X-XSRF-TOKEN',

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  transformRequest: [
    function (data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function (data: any): any {
      return transformResponse(data)
    }
  ]
}

const methodsWithoutData = ['delete', 'get', 'head', 'options']
const methodsWidthData = ['post', 'put', 'patch']

methodsWithoutData.forEach(method => {
  defaults.headers[method] = {}
})

methodsWidthData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults