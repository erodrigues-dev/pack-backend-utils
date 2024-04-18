import { Application } from 'express'

export const useStartupProbe = (app: Application, isReady: () => boolean) => {
  app.get('/snf/startup-probe', (_req, res) => {
    if (isReady()) {
      return res
        .status(200)
        .json({ ok: true, message: 'Application is ready!' })
    }

    return res.status(503).json({
      ok: false,
      message:
        'Application is not ready yet! Please wait a few seconds and try again.',
    })
  })
}
