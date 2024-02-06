import { ApplicationError } from './ApplicationError.js'

export class ClientError extends ApplicationError {
  constructor(message, status, code) {
    super(
      message || 'Invalid request, check the data and try again',
      status || 400,
      code || 'CLIENT_ERROR',
    )
    this.name = 'ClientError'
  }
}
