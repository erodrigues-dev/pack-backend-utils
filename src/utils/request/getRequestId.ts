import { Request } from 'express'
import { randomUUID } from 'node:crypto'

export const getRequestId = (req: Request): string => {
  const headers = ['x-request-id', 'request-id', 'request_id']

  for (const key of headers) {
    if (req.headers[key]) {
      return req.headers[key] as string
    }
  }

  if (req.id) {
    return req.id
  }

  return randomUUID()
}
