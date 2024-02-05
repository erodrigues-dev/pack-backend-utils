import { Buffer } from 'node:buffer'
import { ClientError } from '../customErrors/ClientError.js'

export const setAuthorization = app => {
  app.use((req, _res, next) => {
    req.authorization = {}

    if (req.headers.authorization) {
      const [scheme, credentials] = req.headers.authorization.trim().split(' ')

      const parsed = {
        scheme,
        credentials,
      }

      if (scheme.toLowerCase() === 'basic') {
        const decoded = Buffer.from(credentials, 'base64').toString('utf8')
        if (!decoded) throw new ClientError('Authorization header invalid')
        const [username, password] = decoded.split(':', 2)

        parsed.basic = {
          username,
          password,
        }
      }

      req.authorization = parsed
    }

    return next()
  })
}
