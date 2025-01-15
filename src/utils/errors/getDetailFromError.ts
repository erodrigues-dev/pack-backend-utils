import { AxiosError } from 'axios'

export type Payload = {
  url: string
  method: string
  params: any
  data: any
}

export type DetailFromError = {
  name: string
  origin?: string
  endpoint?: string
  message: string
  status?: number
  response?: any
  stack?: string
  payload?: Payload
}

export const getDetailFromError = (error: Error): DetailFromError => {
  if ((error as AxiosError).isAxiosError) {
    const { config, response, message } = error as AxiosError
    const baseURL = new URL(config.baseURL || (config.url as string))
    const responseData = response?.data as any
    return {
      name: error.name,
      origin: baseURL.hostname,
      endpoint: `[${config.method.toUpperCase()}] ${config.url}`,
      message:
        responseData?.detail?.message || responseData?.message || message,
      status: response?.status,
      response: responseData,
      payload: {
        url: config.url,
        method: config.method.toUpperCase(),
        params: config.params,
        data: config.data,
      },
    }
  }

  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  }
}
