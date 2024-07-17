import { Application } from 'express'
import { createNamespace } from 'cls-hooked'

export const createScopedRequestId = (app: Application) => {
    app.use((req, res, next) => {
        const namespace = createNamespace('scoped-request-id')
        namespace.run(() => {
            namespace.set('requestId', req.id)
            next()
        })
    })
  }