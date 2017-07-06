const express = require('express')
const webpack = require('webpack')
const historyApiFallback = require('connect-history-api-fallback')

const devMiddlewareCreator = require('webpack-dev-middleware')
const hotMiddlewareCreator = require('webpack-hot-middleware')

const options = require('./webpack.config')

const {
  dev: devConfig,
  devMiddleware: devMiddlewareConfig,
  hotMiddleware: hotMiddlewareConfig
} = options
const compiler = webpack(devConfig)

const devMiddleware = devMiddlewareCreator(compiler, devMiddlewareConfig)
const hotMiddleware = hotMiddlewareCreator(compiler, hotMiddlewareConfig)

const app = express()

app.use('/', historyApiFallback)
app.use(devMiddleware)
app.use(hotMiddleware)

app.listen(3000)
