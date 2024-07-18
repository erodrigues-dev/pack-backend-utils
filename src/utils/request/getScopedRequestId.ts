import { createNamespace } from 'cls-hooked'

export const getScopedRequestId = (): string => {
    const namespace = createNamespace('scoped-request-id')
    return namespace.get('requestId')
}