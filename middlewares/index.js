import { errorHandler } from './errorHandler.js'
import { logRequest } from './logRequest.js'
import { logResponse } from './logResponse.js'
import { setApplicationVersion } from './setAplicationVersion.js'
import { setAuthorization } from './setAuthrorization.js'
import { setContentBody } from './setContentBody.js'
import { setLogger } from './setLogger.js'
import { setRequestId } from './setRequestId.js'

export const useBeforeRoutes = (app, config, logger) => {
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
