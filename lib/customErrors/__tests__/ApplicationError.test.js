import { ApplicationError } from '../ApplicationError.js'

describe('Application Error', () => {
  test('should create with default values', () => {
    const sut = new ApplicationError()

    expect(sut).toBeInstanceOf(Error)
    expect(sut.name).toEqual('ApplicationError')
    expect(sut.isCustomError).toEqual(true)
    expect(sut.message).toEqual('Sorry, an unexpected error occurred')
    expect(sut.status).toEqual(500)
    expect(sut.code).toEqual('APPLICATION_ERROR')
  })

  test('should create with message, status and code', () => {
    const sut = new ApplicationError('any_message', 500, 'any_code')

    expect(sut.message).toEqual('any_message')
    expect(sut.status).toEqual(500)
    expect(sut.code).toEqual('any_code')
  })
})
