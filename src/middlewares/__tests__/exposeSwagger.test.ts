import { Application } from 'express'
import { parse as yamlParse } from 'yaml'
import { readFileSync } from 'node:fs'
import { setup as swaggerSetup } from 'swagger-ui-express'

import { exposeSwagger } from '../exposeSwagger'

/*prettier-ignore*/ jest.mock('yaml', () => ({ parse: jest.fn(), }))
/*prettier-ignore*/ jest.mock('node:fs', () => ({ readFileSync: jest.fn(), }))
/*prettier-ignore*/ jest.mock('swagger-ui-express', () => ({ serve: 'swagger.serve', setup: jest.fn(), }))

describe('exposeSwagger', () => {
  test('should expose swagger in /doc route', () => {
    jest.mocked(readFileSync).mockReturnValue('swagger.yaml content')
    jest.mocked(yamlParse).mockReturnValue('swagger_document')
    jest.mocked<any>(swaggerSetup).mockReturnValue('swagger.setup')

    const app = {
      use: jest.fn(),
    } as unknown as Application
    exposeSwagger(app)

    expect(app.use).toHaveBeenCalledWith(
      '/doc',
      'swagger.serve',
      'swagger.setup',
    )
    expect(readFileSync).toHaveBeenCalledWith('./doc/swagger.yaml', 'utf8')
    expect(yamlParse).toHaveBeenCalledWith('swagger.yaml content')
    expect(swaggerSetup).toHaveBeenCalledWith('swagger_document')
  })
})
