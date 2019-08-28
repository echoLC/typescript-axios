import Cancel, { isCancel } from '../../src/cancel/Cancel'

describe('cancel:Cancel', () => {
  test('should return correct result when message is specified', () => {
    const message = 'Operation has been canceled.'
    const cancel = new Cancel(message)
    expect(cancel.message).toBe(message)
  })

  test('should return true if value is a Cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should return false if value is not a Cancel', () => {
    expect(isCancel({ foo: 'bar' })).toBeFalsy()
  })
})
