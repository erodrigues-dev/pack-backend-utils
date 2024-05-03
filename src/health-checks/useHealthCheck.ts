import { Application } from 'express'
import process from 'node:process'
import os from 'node:os'

import { Config } from '../types'

export const useHealthCheck = (app: Application, config: Config) => {
  app.get('/', (_req, res) => {
    res
      .status(200)
      .send(
        `${config.app.name} is running with ${process.env.NODE_ENV} environment on ${os.hostname()}`,
      )
  })
}
