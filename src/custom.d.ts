import { Logger } from './types'

declare global {
  namespace Express {
    export interface Request {
      id: string
      log: Logger
      startTime: number
      detailError: any
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
