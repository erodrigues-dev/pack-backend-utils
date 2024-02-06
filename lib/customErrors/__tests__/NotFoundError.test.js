import { ClientError } from '../ClientError.js'
import { NotFoundError } from '../NotFoundError.js'

describe('Application Error', () => {
  test('should create with default values', () => {
    const sut = new NotFoundError()

    expect(sut).toBeInstanceOf(ClientError)
    expect(sut.name).toEqual('NotFoundError')
    expect(sut.message).toEqual('This resource is not found')
    expect(sut.status).toEqual(404)
    expect(sut.code).toEqual('NOT_FOUND')
  })

  test('should create with message', () => {
    const sut = new NotFoundError('any_message')

    expect(sut.message).toEqual('any_message')
    expect(sut.status).toEqual(404)
    expect(sut.code).toEqual('NOT_FOUND')
  })
})
