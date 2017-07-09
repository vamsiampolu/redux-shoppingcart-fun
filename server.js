// process.env.NODE_ENV = 'development'
const express = require('express')
const webpack = require('webpack')
const React = require('react')
const App = require('./src/app').default
const compose = require('./src/utils/compose').default
const {renderStatic} = require('glamor/server')
const {renderToString} = require('react-dom/server')

const publicPath = '/assets/'

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

// Functional Programming for the sake of Functional Programming,
// extremely clever code, stop reading here, if compose is a hammer
// every thing looks like a unary function

const simpleSSR = compose(renderToString, React.createElement)
const makeFnForGlamor = App => () => simpleSSR(App)

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

const extractAssets = assets => {
  const styles = getLinks(assets)
  const scripts = getScripts(assets)
  return {styles, scripts}
}

const getChunk = stats => {
  const {assetsByChunkName: assets} = stats
  const {main} = assets
  return main
}

const assetsFromStats = stats => {
  return compose(extractAssets, normalizeAssets, getChunk)(stats)
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
  const assets = assetsFromStats(stats)
  const {scripts, styles} = assets

  const fnForGlamor = makeFnForGlamor(App)
  const {html, css, ids} = renderStatic(fnForGlamor)

  const locals = {scripts, styles, css, ids, html}
  res.render('index', locals)
})
app.use(hotMiddleware)

app.listen(3000, err => {
  if (!err) {
    console.log('Server is listening on port 3000')
  }
})
