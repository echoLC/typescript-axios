import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should accept HTTP Basic auth with username/password', () => {
    const auth = {
      username: 'test',
      password: 'test password'
    }
    axios('/foo', {
      auth
    })
    const encodeAuth = btoa(auth.username + ':' + auth.password)
    getAjaxRequest().then(request => {
      expect(request.requestHeaders['Authorization']).toBe('Basic ' + encodeAuth)
    })
  })

  test('should fail to encode HTTP Basic auth credentials with non-Latin1 characters', () => {
    return axios('/foo', {
      auth: {
        username: 'Aladßç£☃din',
        password: 'test passwrod'
      }
    })
      .then(() => {
        throw new Error(
          'should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials.'
        )
      })
      .catch(err => {
        expect(/character/i.test(err.message)).toBeTruthy()
      })
  })
})
