import { jest } from '@jest/globals'

/* prettier-ignore */ jest.unstable_mockModule('../errorHandler.js', () => ({ errorHandler: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../logRequest.js', () => ({ logRequest: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../logResponse.js', () => ({ logResponse: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setApplicationVersion.js', () => ({ setApplicationVersion: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setAuthorization.js', () => ({ setAuthorization: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setContentBody.js', () => ({ setContentBody: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setLogger.js', () => ({ setLogger: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setRequestId.js', () => ({ setRequestId: jest.fn() }))

const { errorHandler } = await import('../errorHandler.js')
const { logRequest } = await import('../logRequest.js')
const { logResponse } = await import('../logResponse.js')
const { setApplicationVersion } = await import('../setApplicationVersion.js')
const { setAuthorization } = await import('../setAuthorization.js')
const { setContentBody } = await import('../setContentBody.js')
const { setLogger } = await import('../setLogger.js')
const { setRequestId } = await import('../setRequestId.js')

const { useBeforeRoutes, useAfterRoutes } = await import('../hooks.js')

const app = { anyValue: 'app' }
const config = { anyValue: 'config' }
const logger = { anyValue: 'logger' }

describe('hooks middleware', () => {
  describe('useBeforeRoutes', () => {
    test('should register correct middlewares', () => {
      useBeforeRoutes(app, config, logger)

      expect(setLogger).toHaveBeenCalledWith(app, logger)
      expect(setRequestId).toHaveBeenCalledWith(app)
      expect(setAuthorization).toHaveBeenCalledWith(app)
      expect(setApplicationVersion).toHaveBeenCalledWith(app, config)
      expect(setContentBody).toHaveBeenCalledWith(app)
      expect(logRequest).toHaveBeenCalledWith(app, config)
    })
  })

  describe('useAfterRoutes', () => {
    test('should register correct middlewares', () => {
      useAfterRoutes(app, config)

      expect(errorHandler).toHaveBeenCalledWith(app, config)
      expect(logResponse).toHaveBeenCalledWith(app, config)
    })
  })
})
