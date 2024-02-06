import { ClientError } from './ClientError.js'

export class NotFoundError extends ClientError {
  constructor(message) {
    super(message || 'This resource is not found', 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}
