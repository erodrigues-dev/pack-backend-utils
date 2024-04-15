import { Application, Request } from 'express'
import { setLogger } from '../setLogger'

describe('setLogger middleware', () => {
  test('should set log in request', async () => {
    const req = {} as unknown as Request
    const res = {}
    const next = jest.fn()

    const logger = { any: 'logger' } as any

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    } as unknown as Application
    setLogger(app, logger)

    expect(req.log).toBe(logger)
    expect(next).toHaveBeenCalled()
  })
})
