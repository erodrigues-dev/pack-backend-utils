import { Axios, AxiosError } from 'axios'

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
  if ((error as AxiosError).isAxiosError) {
    const { config, response, message } = error as AxiosError
    const baseURL = new URL(config?.baseURL as string)
    const responseData = response?.data as any
    return {
      name: error.name,
      origin: baseURL.hostname,
      endpoint: `[${config?.method?.toUpperCase()}] ${config?.url}`,
      message:
        responseData?.detail?.message || responseData?.message || message,
      status: response?.status,
      response: responseData,
      // payload: config.body, // TODO
    }
  }

  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  }
}
