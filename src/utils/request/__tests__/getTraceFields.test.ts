import { Request } from 'express'

import { getTraceFields } from '../getTraceFields'
import { getRequestIp } from '../getRequestIp'

jest.mock('../getRequestIp', () => ({
  getRequestIp: jest.fn(),
}))

describe('getTraceFields', () => {
  test('Should return the correct trace fields with valid data', () => {
    const req = {
      id: 'abc123',
      path: '/api/some-endpoint',
      headers: {
        'x-session-id': 'session123',
        'x-origin-application': 'app1',
        'x-origin-channel': 'web',
        'x-origin-referrer': 'https://example.com',
      },
      authorization: {
        basic: {
          username: 'user123',
        },
      },
    } as unknown as Request

    jest.mocked(getRequestIp).mockReturnValue('192.168.0.1')

    const result = getTraceFields(req)

    expect(getRequestIp).toHaveBeenCalledWith(req)
    expect(result).toEqual({
      requestId: 'abc123',
      requestPath: '/api/some-endpoint',
      sessionId: 'session123',
      origin: {
        ip: '192.168.0.1',
        application: 'app1',
        channel: 'web',
        user: 'user123',
        referrer: 'https://example.com',
      },
    })
  })

  test('Should return the correct trace fields with missing or undefined data', () => {
    const req = {
      id: undefined,
      path: '/api/another-endpoint',
      headers: {},
      authorization: {},
    } as unknown as Request

    jest.mocked(getRequestIp).mockReturnValue(null)

    const result = getTraceFields(req)

    expect(getRequestIp).toHaveBeenCalledWith(req)
    expect(result).toEqual({
      requestId: undefined,
      requestPath: '/api/another-endpoint',
      sessionId: undefined,
      origin: {
        ip: null,
        application: undefined,
        channel: undefined,
        user: undefined,
        referrer: undefined,
      },
    })
  })

  test('Should return the correct trace fields with valid data including x-origin-referrer', () => {
    const req = {
      headers: {
        'x-origin-referrer': 'https://x-origin-referrer.example.com',
      },
    } as unknown as Request

    const result = getTraceFields(req)

    expect(result.origin.referrer).toEqual(
      'https://x-origin-referrer.example.com',
    )
  })

  test('Should return the correct trace fields with valid data including headers.referer', () => {
    const req = {
      headers: {
        referer: 'https://referer.example.com',
      },
    } as unknown as Request

    const result = getTraceFields(req)

    expect(result.origin.referrer).toEqual('https://referer.example.com')
  })

  test('Should return the correct trace fields with valid data including headers.origin', () => {
    const req = {
      headers: {
        origin: 'https://origin.example.com',
      },
    } as unknown as Request

    const result = getTraceFields(req)

    expect(result.origin.referrer).toEqual('https://origin.example.com')
  })
})
