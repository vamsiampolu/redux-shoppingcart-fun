// process.env.NODE_ENV = 'development'
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

const publicPath = '/assets/'

const getScripts = assets => {
  const js = assets.filter(path => path.endsWith('.js'))
  const scripts = js.map(
    path => `<script src="${publicPath}/${path}"></script>`
  )
  return scripts.join('\n')
}

const devMiddlewareConfig = {
  serverSideRender: true,
  stats: 'normal',
  publicPath: publicPath,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300
  }
}

const hotMiddlewareConfig = {
  path: publicPath,
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
app.use(express.static(__dirname + '/public'))
app.use(devMiddleware)
app.use(hotMiddleware)

app.use((req, res) => {
  const stats = res.locals.webpackStats.toJson()
  const assets = normalizeAssets(stats.assetsByChunkName.main)
  const styles = getLinks(assets)
  const scripts = getScripts(assets)
  debugger
  res.send(
    `
<!DOCTYPE html>
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
