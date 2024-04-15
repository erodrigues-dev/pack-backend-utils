import { Application } from 'express'

import { ApplicationError } from '../../customErrors/ApplicationError'
import {
  DetailFromError,
  getDetailFromError,
} from '../../utils/errors/getDetailFromError'
import { errorHandler } from '../errorHandler'
import Joi from 'joi'

jest.mock('../../utils/errors/getDetailFromError', () => ({
  getDetailFromError: jest.fn(),
}))

const makeApp = (...args): Application => {
  return {
    use: jest.fn().mockImplementation(callback => callback(...args)),
  } as unknown as Application
}

const config: any = {
  errorHandler: {
    ignoreDetail: false,
  },
}

describe('errorHandler middleware', () => {
  test('should response with ApplicationError', () => {
    const error = new ApplicationError()
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    const app = makeApp(error, req, res, next)
    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(error.status)
    expect(res.json).toHaveBeenCalledWith({
      code: error.code,
      message: error.message,
    })
    expect(next).toHaveBeenCalledWith()
  })

  test('should response with VALIDATION_ERROR', () => {
    const error = {
      isJoi: true,
      message: 'This is a Joi validation error',
    } as Joi.ValidationError
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    const app = makeApp(error, req, res, next)
    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      code: 'VALIDATION_ERROR',
      message: 'This is a Joi validation error',
    })
    expect(next).toHaveBeenCalledWith()
  })

  test('should response with error if body and statusCode exists', () => {
    const error = {
      statusCode: 403,
      body: {
        code: 'body_code',
        message: 'body_message',
      },
    }
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    const app = makeApp(error, req, res, next)
    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      code: 'BODY_CODE',
      message: 'body_message',
    })
    expect(next).toHaveBeenCalledWith()
  })

  test('should response with SERVER_TIMEOUT_ERROR', () => {
    const error = { status: 502, message: '502 Bad Gateway' } as DetailFromError
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    const app = makeApp(error, req, res, next)

    jest.mocked(getDetailFromError).mockReturnValue(error)

    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith({
      code: 'SERVER_TIMEOUT_ERROR',
      message: '502 Bad Gateway',
      detail: {
        status: 502,
        message: '502 Bad Gateway',
      },
    })
    expect(next).toHaveBeenCalledWith()
  })

  test('should response with INTERNAL_SERVER_ERROR', () => {
    const error = { status: 500, message: 'any_message' } as DetailFromError
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    const app = makeApp(error, req, res, next)

    jest.mocked(getDetailFromError).mockReturnValue(error)

    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sorry, an unexpected error occurred',
      detail: {
        status: 500,
        message: 'any_message',
      },
    })
    expect(next).toHaveBeenCalledWith()
  })

  test('should dont response with detail if config.errorHandler.ignoreDetail is true', () => {
    const error = { status: 500, message: 'any_message' } as DetailFromError
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    const app = makeApp(error, req, res, next)

    jest.mocked(getDetailFromError).mockReturnValue(error)

    config.errorHandler.ignoreDetail = true

    errorHandler(app, config)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Sorry, an unexpected error occurred',
    })
    expect(next).toHaveBeenCalledWith()
  })
})
