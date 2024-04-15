import { errorHandler } from '../errorHandler'
import { logRequest } from '../logRequest'
import { logResponse } from '../logResponse'
import { setApplicationVersion } from '../setApplicationVersion'
import { setAuthorization } from '../setAuthorization'
import { setContentBody } from '../setContentBody'
import { setLogger } from '../setLogger'
import { setRequestId } from '../setRequestId'
import { exposeSwagger } from '../exposeSwagger'

import { useBeforeRoutes, useAfterRoutes } from '../hooks'
import { Application } from 'express'

/* prettier-ignore */ jest.mock('../errorHandler', () => ({ errorHandler: jest.fn() }))
/* prettier-ignore */ jest.mock('../logRequest', () => ({ logRequest: jest.fn() }))
/* prettier-ignore */ jest.mock('../logResponse', () => ({ logResponse: jest.fn() }))
/* prettier-ignore */ jest.mock('../setApplicationVersion', () => ({ setApplicationVersion: jest.fn() }))
/* prettier-ignore */ jest.mock('../setAuthorization', () => ({ setAuthorization: jest.fn() }))
/* prettier-ignore */ jest.mock('../setContentBody', () => ({ setContentBody: jest.fn() }))
/* prettier-ignore */ jest.mock('../setLogger', () => ({ setLogger: jest.fn() }))
/* prettier-ignore */ jest.mock('../setRequestId', () => ({ setRequestId: jest.fn() }))
/* prettier-ignore */ jest.mock('../exposeSwagger', () => ({ exposeSwagger: jest.fn() }))

const app = { anyValue: 'app' } as unknown as Application
const config: any = { anyValue: 'config' }
const logger: any = { anyValue: 'logger' }

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
