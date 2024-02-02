export const setLogger = (app, logger) => {
  app.use((req, _res, next) => {
    req.log = logger
    next()
  })
}
