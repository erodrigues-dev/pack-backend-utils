import { Request } from 'express'

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('newMockedUUID'),
}))

const makeSUT = async () => {
  const { getRequestId } = await import('../getRequestId')
  return getRequestId
}

describe('getRequestId', () => {
  test('Should return the correct value if x-request-id is present in headers', async () => {
    const getRequestId = await makeSUT()

    const req = {
      headers: {
        'x-request-id': '123456789',
      },
    } as unknown as Request

    expect(getRequestId(req)).toBe('123456789')
  })

  test('Should return the correct value if request-id is present in headers', async () => {
    const getRequestId = await makeSUT()

    const req = {
      headers: {
        'request-id': '987654321',
      },
    } as unknown as Request

    expect(getRequestId(req)).toBe('987654321')
  })

  test('Should return the correct value if request_id is present in headers', async () => {
    const getRequestId = await makeSUT()

    const req = {
      headers: {
        request_id: 'abcdef123',
      },
    } as unknown as Request

    expect(getRequestId(req)).toBe('abcdef123')
  })

  test('Should return the correct value if req.id is present', async () => {
    const getRequestId = await makeSUT()

    const req = {
      headers: {},
      id: 'qwerty123',
    } as unknown as Request

    expect(getRequestId(req)).toBe('qwerty123')
  })

  test('Should create a request id', async () => {
    const getRequestId = await makeSUT()

    const req = { headers: {} } as unknown as Request

    expect(getRequestId(req)).toBe('newMockedUUID')
  })
})
