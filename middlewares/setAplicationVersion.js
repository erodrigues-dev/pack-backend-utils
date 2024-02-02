export const setApplicationVersion = (app, config) => {
  app.use((_req, res, next) => {
    res.setHeader('x-application-version', config.app.version)
    next()
  })
}
