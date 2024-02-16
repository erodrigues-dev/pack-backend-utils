import { ClientError } from './ClientError.js'

export class NotFoundError extends ClientError {
  constructor(message) {
    super({
      message: message || 'This resource is not found',
      status: 404,
      code: 'NOT_FOUND',
    })
    this.name = 'NotFoundError'
  }
}
