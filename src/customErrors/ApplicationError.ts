type ConstructorArguments = {
  message?: string
  code?: string
  status?: number
  data?: any
}

export class ApplicationError extends Error {
  name: string
  status: number
  code: string
  isCustomError: boolean
  data: any

  constructor({
    message = 'Sorry, an unexpected error occurred',
    code = 'APPLICATION_ERROR',
    status = 500,
    data = undefined,
  }: ConstructorArguments = {}) {
    super(message)
    this.name = 'ApplicationError'
    this.isCustomError = true
    this.message = message
    this.status = status
    this.code = code
    this.data = data
  }
}

const t = new ApplicationError({ data: { key: 'value' } })
