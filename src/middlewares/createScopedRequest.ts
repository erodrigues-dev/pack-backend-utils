import { Application } from 'express'
import { createNamespace } from 'cls-hooked'

export const createScopedRequest = (app: Application) => {
    app.use((req, res, next) => {
        const namespace = createNamespace('scoped-request')
        namespace.run(() => {
            namespace.set('requestId', req.id)
            namespace.set('sessionId', req.headers['x-session-id'])
            next()
        })
    })
  }