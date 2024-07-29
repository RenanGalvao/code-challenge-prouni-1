// based on https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue
import express from 'express'
import { readFileSync } from 'fs'
import config from './config/index.js'

// Cached production assets
const templateHtml = config.app.isProduction
  ? readFileSync('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = config.app.isProduction
  ? readFileSync('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

const app = express()

// Add Vite or respective production middlewares
let vite
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

// security
// TODO

// middlewares
// TODO

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
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(config.app.port, () => {
  console.log(`Server started at http://localhost:${config.app.port}`)
})