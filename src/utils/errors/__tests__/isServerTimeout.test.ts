import { isServerTimeout } from '../isServerTimeout'

describe('isServerTimeout', () => {
  test('Should return true for status 502', () => {
    const error = { status: 502, message: 'Bad Gateway' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for status 504', () => {
    const error = { status: 504, message: 'Gateway Timeout' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for message containing "502"', () => {
    const error = { status: 400, message: 'Server Error 502' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for message containing "504"', () => {
    const error = { status: 400, message: 'Gateway 504 Timeout' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for message containing "gateway"', () => {
    const error = { status: 400, message: 'Error in gateway' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for message containing "time-out"', () => {
    const error = { status: 400, message: 'Request time-out' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return true for message containing "time-out" (case insensitive)', () => {
    const error = { status: 400, message: 'Request Timeout' }
    expect(isServerTimeout(error)).toBe(true)
  })

  test('Should return false for other error status and messages', () => {
    const error = { status: 404, message: 'Not Found' }
    expect(isServerTimeout(error)).toBe(false)
  })
})
