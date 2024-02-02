export const setContentBody = app => {
  app.use((_req, res, next) => {
    const originalSend = res.send.bind(res)
    res.send = body => {
      res.contentBody = _parseBody(body)
      return originalSend(body)
    }
    next()
  })
}

const _parseBody = body => {
  try {
    if (typeof body === 'string') {
      return JSON.parse(body)
    }

    return body
  } catch {
    return body
  }
}
