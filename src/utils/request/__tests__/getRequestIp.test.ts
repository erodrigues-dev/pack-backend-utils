import { Request } from 'express'
import { getRequestIp } from '../getRequestIp'

describe('getRequestIp', () => {
  test('Should return the correct IP from x-forwarded-for header if present', () => {
    const req = {
      headers: {
        'x-forwarded-for': '192.168.0.1, 10.0.0.1, 172.16.0.1',
      },
      ip: '127.0.0.1',
      socket: {
        remoteAddress: '192.168.1.1',
      },
    } as unknown as Request

    expect(getRequestIp(req)).toBe('192.168.0.1')
  })

  test('Should return the correct IP from req.ip if x-forwarded-for is not present', () => {
    const req = {
      ip: '127.0.0.1',
      headers: {},
      socket: {
        remoteAddress: '192.168.1.1',
      },
    } as unknown as Request

    expect(getRequestIp(req)).toBe('127.0.0.1')
  })

  test('Should return the correct IP from req.socket.remoteAddress if x-forwarded-for and req.ip are not present', () => {
    const req = {
      headers: {},
      socket: {
        remoteAddress: '192.168.1.1',
      },
    } as unknown as Request

    expect(getRequestIp(req)).toBe('192.168.1.1')
  })

  test('Should return null if no valid IP is found', () => {
    const req = { headers: {} } as unknown as Request

    expect(getRequestIp(req)).toBeUndefined()
  })
})
