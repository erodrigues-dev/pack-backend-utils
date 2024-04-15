import { Application } from 'express'
import { Config } from '../types'

export const setApplicationVersion = (app: Application, config: Config) => {
  app.use((_req, res, next) => {
    res.set('x-application-version', config.app.version)
    next()
  })
}
