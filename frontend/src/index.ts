// based on https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue
// and https://github.com/vitejs/vite-plugin-vue
import { ViteDevServer } from 'vite'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { readFileSync } from 'fs'
import config from '@/config/index.js'
import { RateLimiter, ExceptionHandler } from '@/middlewares/index.js'
import { logger, appInitLog } from '@/utils/index.js'

// Cached production assets
const templateHtml = config.app.isProduction
  ? readFileSync('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = config.app.isProduction
  ? JSON.parse(readFileSync('./dist/client/.vite/ssr-manifest.json', 'utf-8'))
  : {}

const app = express();

// Add Vite or respective production middlewares
let vite: ViteDevServer
if (!config.app.isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    base: config.app.base,
    appType: 'custom',
    logLevel: !config.app.isProduction ? 'info' : 'error',
    server: {
      middlewareMode: true,
      hmr: false
    },
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(config.app.base, sirv('./dist/client', { extensions: [] }))
}

// Security
app.disable('x-powered-by')
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'", 'http://localhost:3000', 'http://api:3000']
    }
  }
}))
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

    let template, render
    if (!config.app.isProduction) {
      // Always read fresh template in development
      template = readFileSync('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.js')).render
    } else {
      template = templateHtml
      // @ts-ignore
      render = (await import('./server/entry-server.js')).render
    }

    const [appHtml, preloadLinks] = await render(url, ssrManifest)
    const html = template
      .replace('<!--preload-links-->', preloadLinks)
      .replace('<!--app-html-->', appHtml)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e: any) {
    vite?.ssrFixStacktrace(e)
    logger.warn(e.stack)
    res.status(500).end(e.stack)
  }
})

app.use(ExceptionHandler)

// Start http server
app.listen(config.app.port, () => {
  appInitLog(app._router)
  logger.info(`Server is running at http://localhost:${config.app.port}`)
})
