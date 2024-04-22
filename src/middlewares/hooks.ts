import { Application } from 'express'

import { Config, Logger } from '../types'
import { errorHandler } from './errorHandler'
import { exposeSwagger } from './exposeSwagger'
import { logRequest } from './logRequest'
import { logResponse } from './logResponse'
import { setApplicationVersion } from './setApplicationVersion'
import { setAuthorization } from './setAuthorization'
import { setContentBody } from './setContentBody'
import { setLogger } from './setLogger'
import { setRequestId } from './setRequestId'

export const useBeforeRoutes = (
  app: Application,
  config: Config,
  logger: Logger,
) => {
  exposeSwagger(app)

  setLogger(app, logger)
  setRequestId(app)
  setAuthorization(app)
  setApplicationVersion(app, config)
  setContentBody(app)
  logRequest(app, config)
}

export const useAfterRoutes = (app: Application, config: Config) => {
  errorHandler(app, config)
  logResponse(app, config)
}
