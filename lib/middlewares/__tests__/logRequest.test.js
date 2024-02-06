import { jest } from '@jest/globals'

jest.unstable_mockModule('../../utils/request/getTraceFields.js', () => ({
  getTraceFields: jest.fn().mockReturnValue({
    requestId: 'request-id-123',
    requestPath: '/api/sample',
    sessionId: 'session-id-123',
    origin: {
      application: 'sample-application',
      channel: 'sample',
      user: 'sample-user',
      referrer: 'http://example.com',
      ip: '192.172.100.120',
    },
  }),
}))

const { logRequest } = await import('../logRequest.js')

const makeApp = (req, res, next) => {
  return {
    use(callback) {
      callback(req, res, next)
    },
  }
}

const config = {
  log: {
    requestResponse: {
      ignore: ['/api/sample/ignored-route'],
      ignoreBody: ['/api/sample/ignored-body'],
    },
  },
}

describe('logRequest middleware', () => {
  test('should dont log request if route is configured to ignore', () => {
    const req = {
      path: '/api/sample/ignored-route',
    }
    const res = {}
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logRequest(app, config)

    expect(next).toHaveBeenCalledWith()
  })

  test('should log request', () => {
    const req = {
      path: '/api/sample',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      query: {
        anyQuery: 'any_query_value',
      },
      params: {
        anyParam: 'any_param_value',
      },
      body: {
        anyBody: 'any_body_value',
      },
      log: {
        info: jest.fn(),
      },
    }
    const res = {}
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logRequest(app, config)

    expect(req.log.info).toHaveBeenCalledWith(
      'REQUEST',
      'Api: [POST /api/sample] - Origin: [sample-application] - Ip: [192.172.100.120] - User: [sample-user]',
      {
        natural: {
          method: 'POST',
          origin: {
            application: 'sample-application',
            channel: 'sample',
            ip: '192.172.100.120',
            referrer: 'http://example.com',
            user: 'sample-user',
          },
          requestId: 'request-id-123',
          requestPath: '/api/sample',
          sessionId: 'session-id-123',
        },
        request: {
          body: '{"anyBody":"any_body_value"}',
          headers: { 'Content-Type': 'application/json' },
          params: { anyParam: 'any_param_value' },
          query: { anyQuery: 'any_query_value' },
        },
      },
    )
    expect(next).toHaveBeenCalledWith()
  })

  test('should log empty object if body is undefined', () => {
    const req = {
      path: '/api/sample',
      method: 'get',
      body: undefined,
      log: {
        info: jest.fn(),
      },
    }
    const res = {}
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logRequest(app, config)

    const logObj = req.log.info.mock.calls[0][2]

    expect(logObj).toHaveProperty('request.body', '{}')
  })

  test('should add startTime property in request to calculate elapsed time', () => {
    const req = {
      path: '/api/sample',
      method: 'get',
      log: {
        info: jest.fn(),
      },
    }
    const res = {}
    const next = jest.fn()
    const app = makeApp(req, res, next)

    const now = new Date()
    jest.useFakeTimers({ now })

    logRequest(app, config)

    expect(req.startTime).toEqual(now.getTime())
  })
})
