import { Application } from 'express'
import { Logger } from '../types'

export const setLogger = (app: Application, logger: Logger) => {
  app.use((req, _res, next) => {
    req.log = logger
    next()
  })
}
