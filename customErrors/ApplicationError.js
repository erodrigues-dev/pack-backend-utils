export class ApplicationError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'ApplicationError'
    this.isCustomError = true
    this.message = message || 'Sorry, an unexpected error occurred'
    this.status = status || 500
    this.code = code || 'APPLICATION_ERROR'
  }
}
