import { errorHandler } from './errorHandler'
import { setRequestId } from './setRequestId'

export const beforeRoutes = app => {
  setRequestId(app)
}

export const afterRoutes = app => {
  errorHandler(app)
}
