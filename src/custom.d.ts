import { Logger } from './types'
import { DetailFromError } from './utils/errors/getDetailFromError'

declare global {
  namespace Express {
    export interface Request {
      id: string
      log: Logger
      startTime: number
      detailError?: DetailFromError
      authorization?: {
        scheme: string
        credentials: string
        basic: {
          username: string
          password: string
        }
      }
    }

    export interface Response {
      contentBody: any
    }
  }
}
