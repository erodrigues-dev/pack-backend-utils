import { getTraceFields } from '../utils/request/getTraceFields.js'

export const logResponse = (app, config) => {
  app.use((req, res, next) => {
    const ignoredRoute = config.log.requestResponse?.ignore?.includes(req.path)

    if (ignoredRoute) {
      return next()
    }

    const trace = getTraceFields(req)
    const message = [
      `Status: [${res.statusCode}]`,
      `Api: [${req.method.toUpperCase()} - ${req.path}]`,
      `Origin: [${trace.origin.application}]`,
      `Ip: [${trace.origin.ip}]`,
      `User: [${trace.origin.user}]`,
    ].join(' - ')

    const isError = res.statusCode >= 400
    const isGet = req.method.toUpperCase() === 'GET'
    const isIgnoredBodyRoute = config.log.requestResponse?.ignoreBody?.includes(
      req.path,
    )

    let body = res.contentBody
    if (!isError && (isIgnoredBodyRoute || isGet)) {
      body = {}
    }

    const logger = (isError ? req.log.error : req.log.info).bind(req.log)
    const detail = req.detailError
    const prettyDetail = detail && JSON.stringify(detail)
    const errorObj = detail && {
      name: detail.name,
      message: detail.message,
    }

    logger('RESPONSE', message, {
      response: {
        headers: res.headers,
        body: typeof body === 'object' ? JSON.stringify(body) : body,
        ...(prettyDetail && { detail: prettyDetail }),
      },
      natural: {
        ...trace,
        ...(errorObj && { errorObj }),
        method: req.method.toUpperCase(),
        responseStatusCode: res.statusCode,
        elapsedTime: Math.abs(req.startTime - new Date().getTime()),
        isLoggedIn: Boolean(req.headers['x-provider-id']),
        isError,
      },
    })

    return next()
  })
}
