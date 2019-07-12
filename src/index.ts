import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'
import xhr from './xhr'

function axios (config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  
  return xhr(config).then((res) => {
    res.data = transformResponseData(res)
    return res
  })
}

function processConfig (config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL (config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildURL(url, params)
}

function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformResponseData (res: AxiosResponse): any {
  return transformResponse(res.data)
}

function transformHeaders (config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios