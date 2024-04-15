export class ApplicationError extends Error {
  name: string
  status: number
  code: string
  isCustomError: boolean

  constructor({
    message = 'Sorry, an unexpected error occurred',
    code = 'APPLICATION_ERROR',
    status = 500,
  } = {}) {
    super(message)
    this.name = 'ApplicationError'
    this.isCustomError = true
    this.message = message
    this.status = status
    this.code = code
  }
}
