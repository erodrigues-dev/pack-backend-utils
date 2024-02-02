import { getRequestIp } from './getRequestIp.js'

export const getTraceFields = req => {
  const origin = {
    ip: getRequestIp(req),
    application: req.headers['x-origin-application'],
    channel: req.headers['x-origin-channel'],
    user: req.authorization?.basic?.username || req.user,
    referrer:
      req.headers['x-origin-referrer'] ||
      req.headers.referer ||
      req.headers.origin,
  }

  return {
    requestId: req.id,
    requestPath: req.path,
    sessionId: req.headers['x-session-id'],
    origin,
  }
}
