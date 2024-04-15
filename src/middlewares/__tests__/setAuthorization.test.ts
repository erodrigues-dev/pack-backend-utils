import { Application, NextFunction, Request, Response } from 'express'

import { setAuthorization } from '../setAuthorization'
import { ClientError } from '../../customErrors/ClientError'

describe('setAuthorization middleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let app: Application

  beforeEach(() => {
    req = { headers: {} } as unknown as Request
    res = {} as unknown as Response
    next = jest.fn() as unknown as NextFunction

    app = {
      use(callback) {
        callback(req, res, next)
      },
    } as unknown as Application
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should be undefined authorization object if headers are not present', () => {
    setAuthorization(app)

    expect(req.authorization).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  test('should parse basic authorization header', () => {
    req.headers.authorization = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='

    setAuthorization(app)

    expect(req.authorization).toEqual({
      scheme: 'Basic',
      credentials: 'dXNlcm5hbWU6cGFzc3dvcmQ=',
      basic: {
        username: 'username',
        password: 'password',
      },
    })
    expect(next).toHaveBeenCalled()
  })

  test('should throw ClientError for invalid basic authorization header', () => {
    req.headers.authorization = 'Basic x'

    expect(() => setAuthorization(app)).toThrow(ClientError)
    expect(req.authorization).toBeUndefined()
    expect(next).not.toHaveBeenCalled()
  })
})
