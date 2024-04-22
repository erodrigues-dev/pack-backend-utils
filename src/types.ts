export interface Config {
  app: {
    version: string
  }
  errorHandler?: {
    ignoreDetail: boolean
    logPayload: boolean
  }
  log: {
    requestResponse?: {
      ignore: string[]
      ignoreBody: string[]
    }
  }
}

export interface Logger {
  debug(module: string, message: string, data: any): void
  info(module: string, message: string, data: any): void
  error(module: string, message: string, data: any): void
}
