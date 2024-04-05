import { jest } from '@jest/globals'

import { setAuthorization } from '../setAuthorization'
import { ClientError } from '../../customErrors/ClientError'

describe('setAuthorization middleware', () => {
  let req
  let res
  let next
  let app

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()

    app = {
      use(callback) {
        callback(req, res, next)
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should set empty authorization object if headers are not present', () => {
    setAuthorization(app)

    expect(req.authorization).toEqual({})
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
    expect(req.authorization).toEqual({})
    expect(next).not.toHaveBeenCalled()
  })
})
