const express = require('express')
const path = require('path')
const webpack = require('webpack')
const historyApiFallback = require('connect-history-api-fallback')

const normalizeAssets = assets => {
  return Array.isArray(assets) ? assets : [assets]
}

const getLinks = assets => {
  const styles = assets.filter(path => path.endsWith('.css'))
  const links = styles.map(path => `<link rel="stylesheet" href="${path}" />`)
  return links.join('\n')
}
const getScripts = assets => {
  const js = assets.filter(path => path.endsWith('.js'))
  const scripts = js.map(path => `<script src="${path}"></script>`)
  return scripts.join('\n')
}

const publicPath = '/assets/'

const devMiddlewareConfig = {
  serverSideRender: true,
  stats: 'errors-only',
  publicPath: publicPath,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300
  }
}

const hotMiddlewareConfig = {
  reload: true,
  overlay: true,
  heartbeat: 2000,
  timeout: 2000
}

const devMiddlewareCreator = require('webpack-dev-middleware')
const hotMiddlewareCreator = require('webpack-hot-middleware')

const options = require('./webpack.config')
const assetPath = path.resolve('./public')

const {dev: devConfig} = options

const compiler = webpack(devConfig)
const devMiddleware = devMiddlewareCreator(compiler, devMiddlewareConfig)
const hotMiddleware = hotMiddlewareCreator(compiler, hotMiddlewareConfig)

const app = express()
app.use('/', historyApiFallback)
app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static(assetPath))

app.use((req, res) => {
  const stats = res.locals.webpackStats.toJSON()
  const assets = normalizeAssets(stats.assetsByChunkName.bundle)
  const styles = getLinks(assets)
  const scripts = getScripts(assets)
  res.send(
    `
    <html>
      <head>
        <title>Webpack is crazy</title>
        ${styles}
      </head>
      <body>
      <div id="app">
      </div>
      ${scripts}
      </body>
    </html>
`
  )
})

app.listen(3000, err => {
  if (!err) {
    console.log('Server is listening on port 3000')
  }
})
