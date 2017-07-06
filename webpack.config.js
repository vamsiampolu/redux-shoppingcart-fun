const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const DefinePlugin = webpack.DefinePlugin
const HmrPlugin = webpack.HotModuleReplacementPlugin
const NoErrorsPlugin = webpack.NoErrorsPlugin

const FILE_PATHS = {
  entry: path.resolve('./app.js'),
  hmrEntry: 'webpack-hot-middleware/client',
  publicPath: '/assets/',
  output: path.resolve('./build/public/assets')
}

const devOnly = {
  entry: FILE_PATHS.entry,
  output: {
    path: FILE_PATHS.output,
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': 'development'
    })
  ]
}

const hmr = {
  entry: [FILE_PATHS.hmrEntry, FILE_PATHS.entry],
  plugins: [new HmrPlugin(), new NoErrorsPlugin()]
}

const dev = merge(devOnly, hmr)

const devMiddleware = {
  serverSideRender: false, // enable it after getting the middleware working
  stats: 'errors-only',
  publicPath: FILE_PATHS.publicPath,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300
  }
}

const hotMiddleware = {
  reload: true,
  overlay: true,
  heartbeat: 2000,
  timeout: 2000
}

module.exports = {
  devMiddleware,
  hotMiddleware,
  dev,
  hmr
}
