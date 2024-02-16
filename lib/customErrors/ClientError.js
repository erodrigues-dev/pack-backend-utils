import { ApplicationError } from './ApplicationError.js'

export class ClientError extends ApplicationError {
  constructor({
    message = 'Invalid request, check the data and try again',
    status = 400,
    code = 'CLIENT_ERROR',
  } = {}) {
    super({ message, status, code })
    this.name = 'ClientError'
  }
}
