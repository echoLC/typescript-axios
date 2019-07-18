import { isPlainObject, deepMerge } from './utils'
import { Method } from '../types'

function normalizeHeaderName (headers: any, normalizeName: string): any {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders (headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  const headersContentType = headers['Content-Type']

  if (isPlainObject(data)) {
    if (headers && !headersContentType) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders (headers: string): any {
  const parsed = Object.create(null)

  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')

    key = key.trim().toLowerCase()

    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }

    parsed[key] = val
  })

  return parsed
}

export function flattenHeaders (headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  const methodsForDelete = ['get', 'head', 'delete', 'options', 'post', 'put', 'patch', 'common']

  methodsForDelete.forEach(key => {
    delete headers[key]
  })

  return headers
}

