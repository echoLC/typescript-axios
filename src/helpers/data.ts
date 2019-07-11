import { isPlainObject } from './utils'

export function transformRequest (data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}

export function transformResponse (data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.log('不是合法的json字符串')
    }
  }
  return data
}