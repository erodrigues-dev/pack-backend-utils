import { Application, Request, Response, NextFunction } from 'express'
import { ValidationError } from 'joi'

import { Config } from '../types'
import { ApplicationError } from '../customErrors/ApplicationError'
import { getDetailFromError } from '../utils/errors/getDetailFromError'
import { isServerTimeout } from '../utils/errors/isServerTimeout'

export const errorHandler = (app: Application, config: Config) => {
  app.use(
    (error: Error | any, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).json({
          code: error.code,
          message: error.message,
        })
        return next()
      }

      if ((error as ValidationError).isJoi) {
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
        ? undefined
        : detail

      if (isServerTimeout(detail)) {
        res.status(detail.status as number).json({
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
    },
  )
}
