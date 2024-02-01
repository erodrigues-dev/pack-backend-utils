const { ApplicationError } = require('../customErrors/ApplicationError')
const { getTraceFields } = require('../utils/request/getTraceFields')
const { getDetailFromError } = require('../utils/errors/getDetailFromError')
const { isServerTimeout } = require('../utils/errors/isServerTimeout')

export const errorHandler = app => {
  app.use((error, req, res, next) => {
    if (error instanceof ApplicationError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
      })
      return next()
    }

    if (error.isJoi) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message,
      })
      return next()
    }

    const isFrameworkError = error.body && error.statusCode
    if (isFrameworkError) {
      res.status(error.statusCode).json({
        code: error.body.code.toUpperCase(),
        message: error.body.message,
      })
      return next()
    }

    const trace = getTraceFields(req)
    const detail = getDetailFromError(error)

    req.log.error('ERROR-HANDLER', detail.message, {
      detail: {
        ...detail,
        response: JSON.stringify(detail.response),
      },
      natural: {
        ...trace,
        errorObj: {
          name: detail.name,
          message: detail.message,
        },
      },
    })

    if (isServerTimeout(detail)) {
      res.status(detail.status).json({
        code: 'SERVER_TIMEOUT_ERROR',
        message: detail.message,
        detail,
      })
      return next()
    }

    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sorry, an unexpected error occurred',
      detail,
    })

    return next()
  })
}
