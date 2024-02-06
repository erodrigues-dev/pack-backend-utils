// file: errorUtils.test.js

import { getDetailFromError } from '../getDetailFromError.js'

describe('getDetailFromError', () => {
  describe('Common Error object', () => {
    test('should return Error details', () => {
      const error = new Error('any_message')
      error.stack = 'mocked_stack'

      const result = getDetailFromError(error)

      expect(result).toEqual({
        name: 'Error',
        message: 'any_message',
        stack: 'mocked_stack',
      })
    })
  })

  describe('Axios Error', () => {
    test('should returns details for AxiosError', () => {
      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        config: {
          baseURL: 'https://api.example.com',
          method: 'post',
          url: '/endpoint',
        },
        response: {
          status: 400,
          data: {
            detail: {
              message: 'Detailed error message',
            },
          },
        },
        message: 'Axios error message',
      }

      const result = getDetailFromError(axiosError)

      expect(result).toEqual({
        name: 'AxiosError',
        origin: 'api.example.com',
        endpoint: '[POST] /endpoint',
        message: 'Detailed error message',
        status: 400,
        response: { detail: { message: 'Detailed error message' } },
      })
    })

    test('should priorize response detail message', () => {
      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        config: {
          baseURL: 'https://api.example.com',
          method: 'post',
          url: '/endpoint',
        },
        response: {
          status: 400,
          data: {
            detail: {
              message: 'Detailed error message',
            },
          },
        },
        message: 'Axios error message',
      }

      const result = getDetailFromError(axiosError)

      expect(result.message).toBe('Detailed error message')
    })

    test('should return response message if detail message is not present', () => {
      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        config: {
          baseURL: 'https://api.example.com',
          method: 'post',
          url: '/endpoint',
        },
        response: {
          status: 400,
          data: {
            message: 'Response error message',
            detail: {
              message: undefined,
            },
          },
        },
        message: 'Axios error message',
      }

      const result = getDetailFromError(axiosError)

      expect(result.message).toBe('Response error message')
    })

    test('should return error message if other priorized message is not present', () => {
      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        config: {
          baseURL: 'https://api.example.com',
          method: 'post',
          url: '/endpoint',
        },
        response: {
          status: 400,
          data: {
            message: undefined,
            detail: {
              message: undefined,
            },
          },
        },
        message: 'Axios error message',
      }

      const result = getDetailFromError(axiosError)

      expect(result.message).toBe('Axios error message')
    })
  })
})
