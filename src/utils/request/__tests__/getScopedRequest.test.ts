import { getNamespace, Namespace } from 'cls-hooked'
import { getScopedRequest } from '../getScopedRequest'


jest.mock('cls-hooked', () => {
  const mNamespace = {
    get: jest.fn(),
  }
  return {
    getNamespace: jest.fn(() => mNamespace),
  }
})

describe('getScopedRequest', () => {
  let namespace: Namespace

  beforeEach(() => {
    namespace = getNamespace('scoped-request') as unknown as Namespace
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the request from the namespace', () => {
    (namespace.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'requestId') return 'request-id'
      if (key === 'sessionId') return 'session-id'
      if (key === 'appVersion') return 'app-version'
    })

    const request = getScopedRequest()

    expect(getNamespace).toHaveBeenCalledWith('scoped-request')
    expect(namespace.get).toHaveBeenCalledTimes(3)
    expect(namespace.get).toHaveBeenCalledWith('requestId')
    expect(namespace.get).toHaveBeenCalledWith('sessionId')
    expect(namespace.get).toHaveBeenCalledWith('appVersion')

    expect(request).toEqual({ requestId: 'request-id', sessionId: 'session-id', appVersion: 'app-version'})
  })

  it('should return undefined if requestId and sessionId is not set', () => {
    (namespace.get as jest.Mock).mockReturnValue(undefined)

    const request = getScopedRequest()

    expect(getNamespace).toHaveBeenCalledWith('scoped-request')
    expect(namespace.get).toHaveBeenCalledTimes(3)
    expect(request).toEqual({ requestId: undefined, sessionId: undefined, appVersion: undefined})
  })
})
 