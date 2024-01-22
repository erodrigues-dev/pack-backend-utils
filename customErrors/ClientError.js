import { ApplicationError } from './ApplicationError';

export class ClientError extends ApplicationError {
  constructor(message, status = 400) {
    super(message, status, 'CLIENT_ERROR');
    this.name = 'ClientError';
  }
}
