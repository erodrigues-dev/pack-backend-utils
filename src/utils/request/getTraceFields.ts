import { Request } from 'express'

import { getRequestIp } from './getRequestIp'

export type TraceFields = {
  requestId: string
  requestPath: string
  sessionId?: string
  origin: {
    ip?: string
    application?: string
    channel?: string
    user?: string
    referrer?: string
  }
}

export const getTraceFields = (req: Request): TraceFields => {
  const origin = {
    ip: getRequestIp(req),
    application: req.headers['x-origin-application'] as string,
    channel: req.headers['x-origin-channel'] as string,
    user: (req as any).authorization?.basic?.username as string,
    referrer:
      (req.headers['x-origin-referrer'] as string) ||
      req.headers.referer ||
      req.headers.origin,
  }

  return {
    requestId: (req as any).id as string,
    requestPath: req.path,
    sessionId: req.headers['x-session-id'] as string,
    origin,
  }
}
