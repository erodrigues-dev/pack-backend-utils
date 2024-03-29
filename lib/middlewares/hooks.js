import { errorHandler } from './errorHandler.js'
import { exposeSwagger } from './exposeSwagger.js'
import { logRequest } from './logRequest.js'
import { logResponse } from './logResponse.js'
import { setApplicationVersion } from './setApplicationVersion.js'
import { setAuthorization } from './setAuthorization.js'
import { setContentBody } from './setContentBody.js'
import { setLogger } from './setLogger.js'
import { setRequestId } from './setRequestId.js'

import 'express-async-errors'

export const useBeforeRoutes = (app, config, logger) => {
  exposeSwagger(app)

  setLogger(app, logger)
  setRequestId(app)
  setAuthorization(app)
  setApplicationVersion(app, config)
  setContentBody(app)
  logRequest(app, config)
}

export const useAfterRoutes = (app, config) => {
  errorHandler(app, config)
  logResponse(app, config)
}
