import { Application } from 'express'
import { createNamespace } from 'cls-hooked'
const namespace = createNamespace('scoped-request')

export const createScopedRequest = (app: Application) => {
    app.use((req, res, next) => {
        namespace.run(() => {
            namespace.set('externalLogs', []);
            namespace.set('requestId', req.id)
            namespace.set('sessionId', req.headers['x-session-id'])
            namespace.set('appVersion', req.headers['x-application-version'])
            next()
        })
    })
  }