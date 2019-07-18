import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
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