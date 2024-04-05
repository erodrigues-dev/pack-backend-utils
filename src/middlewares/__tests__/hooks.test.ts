import { jest } from '@jest/globals'

/* prettier-ignore */ jest.unstable_mockModule('../errorHandler', () => ({ errorHandler: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../logRequest', () => ({ logRequest: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../logResponse', () => ({ logResponse: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setApplicationVersion', () => ({ setApplicationVersion: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setAuthorization', () => ({ setAuthorization: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setContentBody', () => ({ setContentBody: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setLogger', () => ({ setLogger: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../setRequestId', () => ({ setRequestId: jest.fn() }))
/* prettier-ignore */ jest.unstable_mockModule('../exposeSwagger', () => ({ exposeSwagger: jest.fn() }))

const { errorHandler } = await import('../errorHandler')
const { logRequest } = await import('../logRequest')
const { logResponse } = await import('../logResponse')
const { setApplicationVersion } = await import('../setApplicationVersion')
const { setAuthorization } = await import('../setAuthorization')
const { setContentBody } = await import('../setContentBody')
const { setLogger } = await import('../setLogger')
const { setRequestId } = await import('../setRequestId')
const { exposeSwagger } = await import('../exposeSwagger')

const { useBeforeRoutes, useAfterRoutes } = await import('../hooks')

const app = { anyValue: 'app' }
const config = { anyValue: 'config' }
const logger = { anyValue: 'logger' }

describe('hooks middleware', () => {
  describe('useBeforeRoutes', () => {
    test('should register correct middlewares', () => {
      useBeforeRoutes(app, config, logger)

      expect(exposeSwagger).toHaveBeenCalledWith(app)
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
