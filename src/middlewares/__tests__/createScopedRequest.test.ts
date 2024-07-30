import { Application } from 'express'
import { createNamespace, Namespace } from 'cls-hooked'
import { createScopedRequest } from '../createScopedRequest'

jest.mock('cls-hooked', () => {
    const mNamespace = {
      run: jest.fn((fn: () => void) => fn()),
      set: jest.fn(),
    }
    return {
      createNamespace: jest.fn(() => mNamespace),
    }
  })

const makeApp = (req, res, next): Application => {
    return {
        use(callback) {
            callback(req, res, next)
        },
    } as unknown as Application
}

describe('createScopedRequest middleware', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should create namespace (scoped-request)', () => {
        const req = { headers: {} }
        const res = {}
        const next = jest.fn()

        const app = makeApp(req, res, next)

        createScopedRequest(app)

        expect(createNamespace).not.toHaveBeenCalledWith('scoped-request')
        expect(next).toHaveBeenCalled()

    })

    test('should set request.id (1234)', () => {
        const req = { id: '1234', headers: { 'x-session-id': '6789'} }
        const res = {}
        const next = jest.fn()

        const mockedNamespace = createNamespace('scoped-request') as unknown as Namespace
        const app = makeApp(req, res, next)

        createScopedRequest(app)

        expect(mockedNamespace.set).toHaveBeenCalledWith('requestId', '1234')
        expect(mockedNamespace.set).toHaveBeenCalledWith('sessionId', '6789')
        expect(next).toHaveBeenCalled()

    })

    test('should set request.id (undefined)', () => {
        const req = { headers: {}}
        const res = {}
        const next = jest.fn()

        const mockedNamespace = createNamespace('scoped-request') as unknown as Namespace
        const app = makeApp(req, res, next)

        createScopedRequest(app)

        expect(mockedNamespace.set).toHaveBeenCalledWith('requestId', undefined)
        expect(mockedNamespace.set).toHaveBeenCalledWith('sessionId', undefined)
        expect(next).toHaveBeenCalled()

    })
})
