import { AxiosError } from 'axios'

export type DetailFromError = {
  name: string
  origin?: string
  endpoint?: string
  message: string
  status?: number
  response?: any
  stack?: string
}

export const getDetailFromError = (error: Error): DetailFromError => {
  if (error instanceof AxiosError) {
    const { config, response, message } = error
    const baseURL = new URL(config?.baseURL as string)
    return {
      name: error.name,
      origin: baseURL.hostname,
      endpoint: `[${config?.method?.toUpperCase()}] ${config?.url}`,
      message:
        response?.data?.detail?.message || response?.data?.message || message,
      status: response?.status,
      response: response?.data,
      // payload: config.body, // TODO
    }
  }

  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  }
}
