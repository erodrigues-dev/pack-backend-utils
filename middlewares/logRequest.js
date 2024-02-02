import { getTraceFields } from '../utils/request/getTraceFields.js'

export const logRequest = (app, config) => {
  app.use((req, _res, next) => {
    const ignoredRoute = config.log.requestResponse?.ignore?.includes(req.path)

    if (ignoredRoute) {
      return next()
    }

    const trace = getTraceFields(req)
    const message = [
      `Api: [${req.method.toUpperCase()} - ${req.path}]`,
      `Origin: [${trace.origin.application}]`,
      `Ip: [${trace.origin.ip}]`,
      `User: [${trace.origin.user}]`,
    ].join(' - ')

    req.log.info('REQUEST', message, {
      request: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: JSON.stringify(req.body || {}),
      },
      natural: {
        ...trace,
        method: req.method.toUpperCase(),
      },
    })

    req.startTime = new Date().getTime()

    return next()
  })
}
