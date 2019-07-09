import { axiosRequestConfig } from './types'
import xhr from './xhr'

function axios (config: axiosRequestConfig):void {
  xhr(config)
}

export default axios