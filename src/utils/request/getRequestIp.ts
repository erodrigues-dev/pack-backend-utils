import { Request } from 'express'

export const getRequestIp = (req: Request): string | undefined => {
  const forwardedForIp = (req.headers['x-forwarded-for'] as string)
    ?.split(',')[0]
    .trim()
  if (forwardedForIp) return forwardedForIp

  const IP_MIN_LENGTH = 7
  if (req.ip && req.ip.length >= IP_MIN_LENGTH) return req.ip

  if (
    req.socket?.remoteAddress &&
    req.socket.remoteAddress.length >= IP_MIN_LENGTH
  ) {
    return req.socket.remoteAddress
  }

  return undefined
}
