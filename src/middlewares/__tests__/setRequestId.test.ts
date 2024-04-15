import { Application, Request } from 'express'

import { getRequestId } from '../../utils/request/getRequestId'
import { setRequestId } from '../setRequestId'

jest.mock('../../utils/request/getRequestId', () => ({
  getRequestId: jest.fn(),
}))

describe('setRequestId middleware', () => {
  test('should set request id and response header', async () => {
    const req = {} as unknown as Request
    const res = { set: jest.fn() }
    const next = jest.fn()

    jest.mocked(getRequestId).mockReturnValue('abc123')

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    } as unknown as Application
    setRequestId(app)

    expect(req.id).toBe('abc123')
    expect(res.set).toHaveBeenCalledWith('x-request-id', 'abc123')
    expect(next).toHaveBeenCalled()
    expect(getRequestId).toHaveBeenCalledWith(req)
  })
})
