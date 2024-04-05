import { Buffer } from 'node:buffer'
import { Application } from 'express'

import { ClientError } from '../customErrors/ClientError'

export const setAuthorization = (app: Application) => {
  app.use((req, _res, next) => {
    if (req.headers.authorization) {
      const [scheme, credentials] = req.headers.authorization.trim().split(' ')

      if (scheme.toLowerCase() === 'basic') {
        const decoded = Buffer.from(credentials, 'base64').toString('utf8')
        if (!decoded)
          throw new ClientError({ message: 'Authorization header invalid' })
        const [username, password] = decoded.split(':', 2)

        req.authorization = {
          scheme,
          credentials,
          basic: {
            username,
            password,
          },
        }
      }
    }

    return next()
  })
}
