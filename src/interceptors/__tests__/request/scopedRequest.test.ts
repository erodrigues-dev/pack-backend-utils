import axios, { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { addScopedRequestInterceptor } from '../../request/scopedRequest'
import * as ScopedRequest from '../../../utils/request/getScopedRequest'

describe('addRequestTracingIdInterceptor', () => {
    let axiosInstance: AxiosInstance
    let mock: MockAdapter

    beforeEach(() => {
        axiosInstance = axios.create()
        mock = new MockAdapter(axiosInstance)
            .onGet('/test-url')
                .reply(200, { data: { msg: 'hello' } })
        
        
        addScopedRequestInterceptor(axiosInstance)
    })

    afterEach(() => {
        jest.clearAllMocks()
      })

    test('should call api with headers passed in interceptor', async () => {
        addScopedRequestInterceptor(axiosInstance)

        jest.spyOn(ScopedRequest, 'getScopedRequest').mockReturnValue({
            requestId: 'test-request-id',
            sessionId: 'test-session-id',
            appVersion: 'test-app-version'
        })

        await axiosInstance.get('/test-url')
        const requestHeaders = mock.history.get[0].headers

        expect(requestHeaders['x-request-id']).toBe('test-request-id')
        expect(requestHeaders['x-session-id']).toBe('test-session-id')
        expect(requestHeaders['x-application-version']).toBe('test-app-version')
    })

    test('should throws exception', async () => {
        let requestHeaders
        jest.spyOn(ScopedRequest, 'getScopedRequest').mockImplementation(() => { throw new Error('throws error...') })
        addScopedRequestInterceptor(axiosInstance)

        expect.hasAssertions()

        try {
            await axiosInstance.get('/test-url')
            requestHeaders = mock.history.get[0].headers
        } catch (error) {
            expect(error.message).toBe('throws error...')
            
        }


    })
})
