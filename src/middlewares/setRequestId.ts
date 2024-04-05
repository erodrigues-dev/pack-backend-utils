import { Application } from 'express'
import { getRequestId } from '../utils/request/getRequestId'

export const setRequestId = (app: Application) => {
  app.use((req, res, next) => {
    const requestId = getRequestId(req)

    req.id = requestId
    res.set('x-request-id', requestId)

    return next()
  })
}
