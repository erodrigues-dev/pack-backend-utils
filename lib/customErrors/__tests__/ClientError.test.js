import { ApplicationError } from '../ApplicationError.js'
import { ClientError } from '../ClientError.js'

describe('Application Error', () => {
  test('should create with default values', () => {
    const sut = new ClientError()

    expect(sut).toBeInstanceOf(ApplicationError)
    expect(sut.name).toEqual('ClientError')
    expect(sut.message).toEqual('Invalid request, check the data and try again')
    expect(sut.status).toEqual(400)
    expect(sut.code).toEqual('CLIENT_ERROR')
  })

  test('should create with message, status and code', () => {
    const sut = new ClientError('any_message', 412, 'any_code')

    expect(sut.message).toEqual('any_message')
    expect(sut.status).toEqual(412)
    expect(sut.code).toEqual('any_code')
  })
})
