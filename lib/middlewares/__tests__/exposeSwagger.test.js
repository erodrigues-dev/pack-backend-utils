import { jest } from '@jest/globals'

const yamlParse = jest.fn()
const readFileSync = jest.fn()
const swaggerSetup = jest.fn()

jest.unstable_mockModule('yaml', () => ({
  default: {
    parse: yamlParse,
  },
}))

jest.unstable_mockModule('node:fs', () => ({
  default: {
    readFileSync,
  },
}))

jest.unstable_mockModule('swagger-ui-express', () => ({
  default: {
    serve: 'swagger.serve',
    setup: swaggerSetup,
  },
}))

const { exposeSwagger } = await import('../exposeSwagger.js')

describe('exposeSwagger', () => {
  test('should expose swagger in /doc route', () => {
    readFileSync.mockReturnValue('swagger.yaml content')
    yamlParse.mockReturnValue('swagger_document')
    swaggerSetup.mockReturnValue('swagger.setup')

    const app = {
      use: jest.fn(),
    }
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
