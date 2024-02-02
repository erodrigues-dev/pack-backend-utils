export const getDetailFromError = error => {
  if (error.isAxiosError) {
    const { config, response, message } = error
    const baseURL = new URL(config.baseURL)
    return {
      name: error.name,
      origin: baseURL.hostname,
      endpoint: `[${config.method.toUpperCase()}] ${config.url}`,
      message:
        response?.data?.detail?.message || response?.data?.message || message,
      status: response?.status,
      response: response?.data,
      payload: config.body, // TODO
    }
  }

  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  }
}
