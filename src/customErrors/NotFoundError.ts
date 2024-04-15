import { ClientError } from './ClientError'

export class NotFoundError extends ClientError {
  constructor({
    message = 'This resource is not found',
    status = 404,
    code = 'NOT_FOUND',
  } = {}) {
    super({
      message,
      status,
      code,
    })
    this.name = 'NotFoundError'
  }
}
