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

const { logResponse } = await import('../logResponse.js')

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

describe('logResponse middleware', () => {
  test('should ignore route', () => {
    const req = {
      path: '/api/sample/ignored-route',
    }
    const res = {}
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    expect(next).toHaveBeenCalledWith()
  })

  test('should log success response', () => {
    const now = new Date()
    jest.useFakeTimers({ now })

    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'POST',
      headers: {},
      log: {
        info: jest.fn(),
      },
      startTime: now.getTime() - 100,
    }
    const res = {
      statusCode: 200,
      getHeaders: () => ({ 'Content-Type': 'application/json' }),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    expect(req.log.info).toHaveBeenCalledWith(
      'RESPONSE',
      'Status: [200] - Api: [POST /api/sample] - Origin: [sample-application] - Ip: [192.172.100.120] - User: [sample-user]',
      {
        natural: {
          elapsedTime: 100,
          isError: false,
          isLoggedIn: false,
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
          responseStatusCode: 200,
          sessionId: 'session-id-123',
        },
        response: {
          body: '{"has":"body"}',
          headers: { 'Content-Type': 'application/json' },
        },
      },
    )
    expect(next).toHaveBeenCalledWith()
  })

  test('should log body as simple string', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'POST',
      headers: {},
      log: {
        info: jest.fn(),
      },
    }
    const res = {
      statusCode: 200,
      getHeaders: () => ({ 'Content-Type': 'application/text' }),
      contentBody: '200 OK',
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    const logObj = req.log.info.mock.calls[0][2]

    expect(logObj).toHaveProperty('response.body', '200 OK')
  })

  test('should dont log body if route is configured to ignore body', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample/ignored-body',
      method: 'POST',
      headers: {},
      log: {
        info: jest.fn(),
      },
    }
    const res = {
      statusCode: 200,
      getHeaders: jest.fn(),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    const logObj = req.log.info.mock.calls[0][2]

    expect(logObj).toHaveProperty('response.body', '{}')
  })

  test('should dont log body if request is a GET method', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'GET',
      headers: {},
      log: {
        info: jest.fn(),
      },
    }
    const res = {
      statusCode: 200,
      getHeaders: jest.fn(),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    const logObj = req.log.info.mock.calls[0][2]

    expect(logObj).toHaveProperty('response.body', '{}')
  })

  test('should log body if is Error response', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'GET',
      headers: {},
      log: {
        info: jest.fn(),
      },
    }
    const res = {
      statusCode: 400,
      getHeaders: jest.fn(),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    const logObj = req.log.info.mock.calls[0][2]

    expect(logObj).toHaveProperty('response.body', '{"has":"body"}')
  })

  test('should use level:50 if response status code >= 500', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'GET',
      headers: {},
      log: {
        error: jest.fn(),
      },
    }
    const res = {
      statusCode: 500,
      getHeaders: jest.fn(),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    expect(req.log.error).toHaveBeenCalled()
  })

  test('should log detail Error if is present in request', () => {
    const req = {
      ip: '192.172.100.120',
      path: '/api/sample',
      method: 'GET',
      headers: {},
      log: {
        error: jest.fn(),
      },
      detailError: {
        name: 'AnyError',
        message: 'any_error_message',
      },
    }
    const res = {
      statusCode: 500,
      getHeaders: jest.fn(),
      contentBody: { has: 'body' },
    }
    const next = jest.fn()
    const app = makeApp(req, res, next)

    logResponse(app, config)

    const logObj = req.log.error.mock.calls[0][2]

    expect(logObj).toHaveProperty(
      'response.detail',
      '{"name":"AnyError","message":"any_error_message"}',
    )
    expect(logObj).toHaveProperty('natural.errorObj', {
      name: 'AnyError',
      message: 'any_error_message',
    })
  })
})
