import { Application } from 'express'
import { createNamespace, Namespace } from 'cls-hooked'
import { createScopedRequestId } from '../createScopedRequestId'

jest.mock('cls-hooked', () => {
    const mNamespace = {
      run: jest.fn((fn: () => void) => fn()),
      set: jest.fn(),
    };
    return {
      createNamespace: jest.fn(() => mNamespace),
    };
  });

const makeApp = (req, res, next): Application => {
    return {
        use(callback) {
            callback(req, res, next)
        },
    } as unknown as Application
}

describe('createScopedRequestId middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should create namespace (scoped-request-id)', () => {
        const req = {}
        const res = {}
        const next = jest.fn()

        const app = makeApp(req, res, next)

        createScopedRequestId(app)

        expect(createNamespace).toHaveBeenCalledWith('scoped-request-id')
        expect(next).toHaveBeenCalled()

    })

    test('should set request.id (1234)', () => {
        const req = { id: '1234'}
        const res = {}
        const next = jest.fn()

        const mockedNamespace = createNamespace('scoped-request-id') as unknown as Namespace
        const app = makeApp(req, res, next)

        createScopedRequestId(app)

        expect(mockedNamespace.set).toHaveBeenCalledWith('requestId', '1234')
        expect(next).toHaveBeenCalled()

    })

    test('should set request.id (undefined)', () => {
        const req = {}
        const res = {}
        const next = jest.fn()

        const mockedNamespace = createNamespace('scoped-request-id') as unknown as Namespace
        const app = makeApp(req, res, next)

        createScopedRequestId(app)

        expect(mockedNamespace.set).toHaveBeenCalledWith('requestId', undefined)
        expect(next).toHaveBeenCalled()

    })
})
