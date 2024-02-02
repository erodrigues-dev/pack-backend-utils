import { ApplicationError } from '../customErrors/ApplicationError.js'
import { getDetailFromError } from '../utils/errors/getDetailFromError.js'
import { isServerTimeout } from '../utils/errors/isServerTimeout.js'

export const errorHandler = (app, config) => {
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

    const detail = getDetailFromError(error)

    req.detailError = detail
    const responseDetail = config.errorHandler?.ignoreDetail
      ? { name: detail.name, message: detail.message }
      : detail

    if (isServerTimeout(detail)) {
      res.status(detail.status).json({
        code: 'SERVER_TIMEOUT_ERROR',
        message: detail.message,
        detail: responseDetail,
      })
      return next()
    }

    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sorry, an unexpected error occurred',
      detail: responseDetail,
    })

    return next()
  })
}
