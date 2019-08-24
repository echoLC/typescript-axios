import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helpers: data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a plain object', () => {
      const data = { a: 123 }
      expect(transformRequest(data)).toBe('{"a":123}')
    })

    test('should do nothing if data is not a plain object', () => {
      const data = new URLSearchParams('id=123')
      expect(transformRequest(data)).toBe(data)
    })

    describe('transformResponse', () => {
      test('should transform response data to Object if data is a JSON string', () => {
        const data = '{"a":123}'
        expect(transformResponse(data)).toEqual({ a: 123 })
      })

      test('should do nothing if data is a string but not a JSON string', () => {
        const data = '{a:123}'
        expect(transformResponse(data)).toBe('{a:123}')
      })

      test('should do nothing if data is not a string', () => {
        const data = [1, 2, 3]
        expect(transformResponse(data)).toBe(data)
      })
    })
  })
})
