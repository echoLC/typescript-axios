import axios from '../src/index'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults

  test('should accept undefind for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  test('should accept an object for second argument', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  test('should not leave references', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('should allow setting request options', () => {
    const config = {
      url: 'url',
      params: 'params',
      data: { foo: 'bar' }
    }

    const merged = mergeConfig(defaults, config)
    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })

  test('should not inherit request options', () => {
    const localDefaults = {
      url: 'url',
      params: 'params',
      data: { foo: 'bar' }
    }
    const merged = mergeConfig(localDefaults, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  test('should return defaults if pass config2 with undefined', () => {
    expect(mergeConfig({ headers: 'x-mock-header' }, undefined)).toEqual({
      headers: 'x-mock-header'
    })
  })

  test('should merge auth, headers width defaults', () => {
    expect(
      mergeConfig(
        { auth: undefined },
        {
          auth: {
            username: 'username',
            password: 'password'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'username',
        password: 'password'
      }
    })

    expect(
      mergeConfig(
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        },
        {
          auth: {
            username: 'foo',
            password: 'test password'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'foo',
        password: 'test password'
      }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    expect(
      mergeConfig(
        {
          headers: {
            common: {
              Accept: 'application/json, text/plain, */*'
            }
          }
        },
        {
          headers: null
        }
      )
    ).toEqual({
      headers: null
    })
  })

  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, {
      timeout: 2000
    })
    expect(merged.timeout).toBe(2000)
  })
})
