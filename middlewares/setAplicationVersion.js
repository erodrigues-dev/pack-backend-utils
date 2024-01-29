import process from 'node:process'
import path from 'node:path'

export const setApplicationVersion = app => {
  import(path.join(process.cwd(), 'package.json'), {
    assert: { type: 'json' },
  }).then(({ default: { version } }) => {
    app.use((_req, res, next) => {
      res.setHeader('x-application-version', version)
      next()
    })
  })
}
