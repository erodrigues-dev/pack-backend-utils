import { Application } from 'express'
import { setApplicationVersion } from '../setApplicationVersion'

describe('setAuthorization middleware', () => {
  test('should set header application version in response', () => {
    const req = {}
    const res = { set: jest.fn() }
    const next = jest.fn()

    const app = {
      use(callback) {
        callback(req, res, next)
      },
    } as unknown as Application
    const config: any = {
      app: { version: '3.x.x' },
    }
    setApplicationVersion(app, config)

    expect(res.set).toHaveBeenCalledWith('x-application-version', '3.x.x')
    expect(next).toHaveBeenCalled()
  })
})
