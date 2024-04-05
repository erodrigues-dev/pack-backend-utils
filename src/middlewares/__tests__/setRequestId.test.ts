import { jest } from '@jest/globals'

jest.unstable_mockModule('../../utils/request/getRequestId', () => ({
  getRequestId: jest.fn(),
}))

const { getRequestId } = await import('../../utils/request/getRequestId')
const { setRequestId } = await import('../setRequestId')

describe('setRequestId middleware', () => {
  test('should set request id and response header', async () => {
    const req = {}
    const res = { set: jest.fn() }
    const next = jest.fn()

    getRequestId.mockReturnValue('abc123')

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    }
    setRequestId(app)

    expect(req.id).toBe('abc123')
    expect(res.set).toHaveBeenCalledWith('x-request-id', 'abc123')
    expect(next).toHaveBeenCalled()
    expect(getRequestId).toHaveBeenCalledWith(req)
  })
})
