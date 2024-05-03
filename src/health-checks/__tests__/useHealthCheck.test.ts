import { Application } from 'express'
import { useHealthCheck } from '../useHealthCheck'
import { Config } from '../../types'

describe('useHealthCheck', () => {
  test('should return 200 status code', () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    const appGet = jest.fn((path, cb) => {
      cb(req, res)
    })

    const app = {
      get: appGet,
    } as unknown as Application
    const config = {
      app: { name: 'any_app_name' },
    } as unknown as Config

    useHealthCheck(app, config)

    expect(res.status).toHaveBeenCalledWith(200)
  })
})
