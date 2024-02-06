export const setApplicationVersion = (app, config) => {
  app.use((_req, res, next) => {
    res.set('x-application-version', config.app.version)
    next()
  })
}
