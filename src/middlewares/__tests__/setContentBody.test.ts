import { jest } from '@jest/globals'
import { setContentBody } from '../setContentBody'

describe('setContentBody middleware', () => {
  test('should create contentBody in response', () => {
    const req = {}
    const res = { send: jest.fn() }
    const next = jest.fn()

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    }
    setContentBody(app)
    res.send({ any: 'body' })

    expect(res.contentBody).toEqual({ any: 'body' })
  })

  test('should parse content body to json', () => {
    const req = {}
    const res = { send: jest.fn() }
    const next = jest.fn()

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    }
    setContentBody(app)
    res.send('{ "message":  "i am a json data" }')

    expect(res.contentBody).toEqual({ message: 'i am a json data' })
  })

  test('should ignore content body parser error', () => {
    const req = {}
    const res = { send: jest.fn() }
    const next = jest.fn()

    const app = {
      use(cb) {
        cb(req, res, next)
      },
    }
    setContentBody(app)
    res.send('i am a simple string')

    expect(res.contentBody).toEqual('i am a simple string')
  })
})
