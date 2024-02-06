import { getRequestId } from '../utils/request/getRequestId.js'

export const setRequestId = app => {
  app.use((req, res, next) => {
    const requestId = getRequestId(req)

    req.id = requestId
    res.set('x-request-id', requestId)

    return next()
  })
}
