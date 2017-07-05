const webpack = require('webpack')
const path = require('path')

const FILE_PATHS = {
  entry: path.resolve('./app.js'),
  hmrEntry: 'webpack-hot-middleware/client',
  publicPath: '/assets/',
  output: path.resolve('./build/public/assets')
}

const DefinePlugin = webpack.DefinePlugin

const HmrPlugin = webpack.HotModuleReplacementPlugin
const NoErrorsPlugin = webpack.NoErrorsPlugin

const dev = {
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
  entry: [
    FILE_PATHS.hmrEntry,
    FILE_PATHS.entry
  ],
  plugins: [
    new HmrPlugin(),
    new NoErrorsPlugin()
  ]
}

const devServerOptions = {
  stats: 'errors-only',
  publicPath: FILE_PATHS.publicPath,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300
  }
}

module.exports = {
  devServerOptions,
  dev,
  hmr
}
