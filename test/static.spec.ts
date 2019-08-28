import axios from '../src/index'

describe('static', () => {
  test('should support all', done => {
    let fulfilled = false

    axios.all([false, true]).then(args => {
      fulfilled = args[1]
    })

    setTimeout(() => {
      expect(fulfilled).toBeTruthy()
      done()
    }, 100)
  })

  test('should support spread', done => {
    let sum = 0
    let fulfilled = false
    let result: any

    axios
      .all([123, 456])
      .then(
        axios.spread((a, b) => {
          sum = a + b
          fulfilled = true
          return 'hello, world'
        })
      )
      .then(res => {
        result = res
      })

    setTimeout(() => {
      expect(sum).toBe(579)
      expect(fulfilled).toBeTruthy()
      expect(result).toBe('hello, world')
      done()
    })
  })
})
