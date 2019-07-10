const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
  return toString.call(val) === '[Object Date]'
}

export function isPlainObject (val: any): val is Object {
  return toString.call(val) === '[object Object]'
}