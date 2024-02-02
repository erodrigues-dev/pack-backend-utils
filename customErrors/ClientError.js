import { ApplicationError } from './ApplicationError.js'

export class ClientError extends ApplicationError {
  constructor(message, status = 400) {
    super(message, status, 'CLIENT_ERROR')
    this.name = 'ClientError'
  }
}
