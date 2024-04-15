import { Application } from 'express'
import yaml from 'yaml'
import swagger from 'swagger-ui-express'
import fs from 'node:fs'

export const exposeSwagger = (app: Application) => {
  const file = fs.readFileSync('./doc/swagger.yaml', 'utf8')
  const swaggerDocument = yaml.parse(file)

  app.use('/doc', swagger.serve, swagger.setup(swaggerDocument))
}
