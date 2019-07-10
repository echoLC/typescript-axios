import { axiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import xhr from './xhr'

function axios (config: axiosRequestConfig):void {
  processConfig(config)
  xhr(config)
}

function processConfig (config: axiosRequestConfig): void {
  config.url = transformURL(config)
}

function transformURL (config: axiosRequestConfig): string {
  const { url, params } = config

  return buildURL(url, params)
}

export default axios