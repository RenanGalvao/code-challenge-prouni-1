// based on https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue
import { ViteDevServer } from 'vite'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { readFileSync } from 'fs'
import config from '@/config/index'
import { RateLimiter, ExceptionHandler, Custom404 } from '@/middlewares'
import { logger, appInitLog } from '@/utils'

// Cached production assets
const templateHtml = config.app.isProduction
  ? readFileSync('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = config.app.isProduction
  ? readFileSync('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

const app = express();
let vite: ViteDevServer

// too much trouble with top-level await and re-mapped imports from typescript
// using this hack instead
(async () => {
  // Add Vite or respective production middlewares
  if (!config.app.isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base: config.app.base
    })
    app.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(config.app.base, sirv('./dist/client', { extensions: [] }))
  }
})()

// Security
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  exposedHeaders: [
    'X-Total-Count', 'X-Total-Pages',
    'Retry-After', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'
  ]
}))

// Midlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(RateLimiter)

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(config.app.base, '')

    let template
    let render
    if (!config.app.isProduction) {
      // Always read fresh template in development
      template = readFileSync('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render
    } else {
      template = templateHtml
      // @ts-ignore
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e: any) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.use(Custom404)
app.use(ExceptionHandler)

// Start http server
app.listen(config.app.port, () => {
  appInitLog(app._router)
  logger.info(`Server is running at http://localhost:${config.app.port}`)
})