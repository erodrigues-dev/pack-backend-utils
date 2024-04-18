import { useStartupProbe } from '../useStartupProbe'

describe('useStartupProbe', () => {
  test('should return 200 if isReady returns true', () => {
    const isReady = jest.fn().mockReturnValue(true)
    const app = {
      get: jest.fn(),
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    app.get.mockImplementation((_, cb) => cb({}, res))
    const { useStartupProbe } = require('../useStartupProbe')

    useStartupProbe(app, isReady)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      message: 'Application is ready!',
    })
  })

  test('should return 503 if isReady returns false', () => {
    const isReady = jest.fn().mockReturnValue(false)
    const app = {
      get: jest.fn(),
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    app.get.mockImplementation((_, cb) => cb({}, res))
    const { useStartupProbe } = require('../useStartupProbe')

    useStartupProbe(app, isReady)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      message:
        'Application is not ready yet! Please wait a few seconds and try again.',
    })
  })
})
