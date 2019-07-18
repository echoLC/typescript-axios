import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import xhr from './xhr'
import transform from './transform'

function axios (config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  
  return xhr(config).then((res) => {
    res.data = transformResponseData(res)
    return res
  })
}

function processConfig (config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL (config: AxiosRequestConfig): string {
  const { url, params } = config

  return buildURL(url!, params)
}

function transformResponseData (res: AxiosResponse): any {
  return transform(res.data, res.headers, res.config.transformResponse)
}

export default axios