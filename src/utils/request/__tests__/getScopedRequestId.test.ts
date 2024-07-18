import { createNamespace, Namespace } from 'cls-hooked'
import { getScopedRequestId } from '../getScopedRequestId'


jest.mock('cls-hooked', () => {
  const mNamespace = {
    get: jest.fn(),
  }
  return {
    createNamespace: jest.fn(() => mNamespace),
  }
})

describe('getScopedRequestId', () => {
  let namespace: Namespace

  beforeEach(() => {
    namespace = createNamespace('scoped-request-id') as unknown as Namespace
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the requestId from the namespace', () => {
    (namespace.get as jest.Mock).mockReturnValue('test-id')

    const requestId = getScopedRequestId()

    expect(createNamespace).toHaveBeenCalledWith('scoped-request-id')
    expect(namespace.get).toHaveBeenCalledWith('requestId')
    expect(requestId).toBe('test-id')
  })

  it('should return undefined if requestId is not set', () => {
    (namespace.get as jest.Mock).mockReturnValue(undefined)

    const requestId = getScopedRequestId()

    expect(createNamespace).toHaveBeenCalledWith('scoped-request-id')
    expect(namespace.get).toHaveBeenCalledWith('requestId')
    expect(requestId).toBeUndefined()
  })
})
