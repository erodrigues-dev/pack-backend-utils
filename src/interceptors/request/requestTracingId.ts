import { AxiosInstance } from 'axios'
import { getScopedRequest } from '../../utils/request/getScopedRequest'


export const addRequestTracingIdInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config: any) => {
            const scopedRequest = getScopedRequest()
            const headers = { ...config.headers }

            headers['x-request-id'] = scopedRequest.requestId
            headers['x-session-id'] = scopedRequest.sessionId

            return {
                ...config,
                headers
            }
        }, error => {
            return Promise.reject(error)
        }
    )
}