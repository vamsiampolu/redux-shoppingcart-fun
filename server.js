// process.env.NODE_ENV = 'development'
const express = require('express')
const webpack = require('webpack')
const React = require('react')
const App = require('./src/app').default
const {renderToString} = require('react-dom/server')

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
  const scripts = js.map(path => `<script src="${path}"></script>`)
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
  reload: true,
  overlay: true
}

const devMiddlewareCreator = require('webpack-dev-middleware')
const hotMiddlewareCreator = require('webpack-hot-middleware')

const options = require('./webpack.config')

const {dev: devConfig} = options

const compiler = webpack(devConfig)
const devMiddleware = devMiddlewareCreator(compiler, devMiddlewareConfig)
const hotMiddleware = hotMiddlewareCreator(compiler, hotMiddlewareConfig)

const app = express()
app.set('view engine', 'ejs')
app.use(devMiddleware)

app.use((req, res) => {
  const stats = res.locals.webpackStats.toJson()
  const assets = normalizeAssets(stats.assetsByChunkName.main)
  const styles = getLinks(assets)
  const scripts = getScripts(assets)
  debugger
  const html = renderToString(<App />)
  const locals = {scripts, styles, html}
  res.render('index', locals)
})
app.use(hotMiddleware)
// app.use(express.static(__dirname + '/public'))

app.listen(3000, err => {
  if (!err) {
    console.log('Server is listening on port 3000')
  }
})
