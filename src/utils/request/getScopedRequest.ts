import { getNamespace } from 'cls-hooked'

export const getScopedRequest = (): { requestId:string, sessionId: string, appVersion: string } => {
    const namespace = getNamespace('scoped-request')
    return { 
        requestId: namespace?.get('requestId'),
        sessionId: namespace?.get('sessionId'),
        appVersion: namespace?.get('appVersion')
    }
}