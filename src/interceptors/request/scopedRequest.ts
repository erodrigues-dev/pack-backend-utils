import { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getScopedRequest } from '../../utils/request/getScopedRequest'


export const addScopedRequestInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig<any>) => {
            const scopedRequest = getScopedRequest()
            const headers = { ...config.headers }

            headers['x-request-id'] = scopedRequest.requestId
            headers['x-session-id'] = scopedRequest.sessionId
            headers['x-application-version'] = scopedRequest.appVersion

            return {
                ...config,
                headers
            } as InternalAxiosRequestConfig<any>
            
        }, error => {
            return Promise.reject(error)
        }
    )
}