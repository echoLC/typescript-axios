import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('heplers: error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'get' }
    const response: AxiosResponse = {
      status: 404,
      statusText: 'ok',
      headers: null,
      request,
      config,
      data: { abc: 123 }
    }

    const error = createError('Boom!', config, 'error', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.code).toBe('error')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
