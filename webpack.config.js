const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const DefinePlugin = webpack.DefinePlugin
const HmrPlugin = webpack.HotModuleReplacementPlugin
const NoErrorsPlugin = webpack.NoErrorsPlugin

// path.resolve('./build/public/assets')
const FILE_PATHS = {
  entry: path.resolve('./src/app.js'),
  reactHotLoader: 'react-hot-loader/patch',
  hmrEntry: 'webpack-hot-middleware/client',
  output: '/' // this is the path used by webpack-dev-middleware, the docs say no real path is required, just pass in `/`
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
  entry: [FILE_PATHS.reactHotLoader, FILE_PATHS.hmrEntry, FILE_PATHS.entry],
  plugins: [new HmrPlugin(), new NoErrorsPlugin()]
}

const dev = merge(devOnly, hmr)

module.exports = {
  dev
}
