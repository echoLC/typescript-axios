import {
  isPlainObject,
  isDate,
  isURLSearchParams
} from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

function encode (val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL (url: string, params: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }

  let serializeParam
  const parts: string[] = []

  if (paramsSerializer) {
    serializeParam = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializeParam = params.toString()
  } else {
    Object.keys(params).forEach(key => {
      const val = params[key]
  
      if (val === null || val === undefined) {
        return
      }
  
      let values = []
  
      if (Array.isArray(val)) {
        values = val
      } else {
        values = [val]
      }
  
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
  
    serializeParam = parts.join('&')
  }

  if (serializeParam) {
    const markIndex = url.indexOf('#')

    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    const operator = (url.indexOf('?') !== -1) ? '&' : '?'

    url += `${operator}${serializeParam}`
  }

  return url
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin (requestUrl: string): boolean {
  const requestOrigin = resolveURL(requestUrl)
  return requestOrigin.protocol === currentOrigin.protocol && requestOrigin.host === currentOrigin
    .host
}

function resolveURL (url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const {
    protocol,
    host
  } = urlParsingNode
  return {
    protocol,
    host
  }
}
