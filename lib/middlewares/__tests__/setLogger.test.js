import { jest } from '@jest/globals'
import { setLogger } from '../setLogger.js'

describe('setLogger middleware', () => {
  test('should set log in request', async () => {
    const req = {}
    const res = {}
    const next = jest.fn()

    const logger = { any: 'logger' }

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    }
    setLogger(app, logger)

    expect(req.log).toBe(logger)
    expect(next).toHaveBeenCalled()
  })
})
