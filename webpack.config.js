const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const DefinePlugin = webpack.DefinePlugin
const HmrPlugin = webpack.HotModuleReplacementPlugin
const NoErrorsPlugin = webpack.NoEmitOnErrorsPlugin

const FILE_PATHS = {
  entry: path.resolve('./src/index.js'),
  reactHotLoader: 'react-hot-loader/patch',
  hmrEntry: 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', // this is from the webpack-hot-middleware docs
  output: '/' // this is the path used by webpack-dev-middleware, the docs say no real path is required, just pass in `/`
}

const devOnly = {
  entry: FILE_PATHS.entry,
  output: {
    path: '/',
    publicPath: 'http://localhost:3000/assets/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        // react-hot-loader asks to include src and exclude node_modules in https://github.com/gaearon/react-hot-loader/blob/master/docs/Troubleshooting.md
        include: path.resolve('./src'),
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
  plugins: [new HmrPlugin(), new NoErrorsPlugin()],
  devServer: {
    hot: true
  }
}

const dev = merge(devOnly, hmr)

module.exports = {
  dev
}
