import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import xhr from './xhr'
import transform from './transform'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)

  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    err => {
      if (err && err.response) {
        err.response = transformResponseData(err.response)
      }
      return Promise.reject(err)
    }
  )
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config

  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): any {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default axios
