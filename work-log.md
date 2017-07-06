6th July 2017:
Plan: Get started with a minimal webpack config. Dont worry about loading css with a css-loader or something of that sort, I will rely on glamorous for this project and see what that gives me. Another option would be to completely skip over webpack and use rollup because it understands ES6, creates a lean bundle and does tree shaking by  default with almost no configuration.

I would have to check to see if rollup has any support for hot module reloading and applying hot updates. We are back to webpack.

7th July 2017:

A few plot twists later, I am using webpack. I am using webpack in a way that I have never used webpack before. I will use it as a Node.js API anduse that to compile my bundle.

Another descision I took is to side-step the css problem, I am not going to add a css-loader, a style-loader or an ExtractTextPlugin. In unrelated news, screw you ExtractCssChunksWebpackPlugin, PurifyCssPlugin and isomorphic-style-loader.

I will pick a css framework, go through its source code, pick out the components that I need and build simple functions that will then be used with glamorous.

All icons will use `svg-sprite-loader` and a runtime component to inline it. I will set it up when I need it.

I have created this to inform myself of the configuration options for `webpack-dev-middleware:

|Option|Description|Example|
|:----:|:---------:|:-----:|
|publicPath| required, must be the same as the one provided to `webpack`, used to serve files|`'/assets/'`|
|watchOptions| good to have, windows and some linux flavors have issues with `webpack`, use this to poll for changes at regular intervals|`{poll: 1000, aggregateTimeout}`|

> When using watchOptions with the example config presented above, it will check the file system for changes every 1 second and wait 300ms before sending an update down. Is this super hot update nope, but at least it works.

I am not sure if the last 2 options are compatible with `webpack-dev-middleware`, when I implement, I will try these out, additionally, there is a serverSideRender option within the middleware options, it is experimental I will work with it if I can.

`overlay` is an option meant to be used with `webpack-hot-middleware`, another package created by the same guy who happens to be managing the `webpack-dev-middleware`. This option was later copied by `create-react-app` and then used by the `webpack-dev-server`.

There seems to be no mention of `historyApiFallback` anywhere, I am looking carefully at the `kriasoft/rect-starter-kit` but so far, they havent touched upon it. I looked into it, it is a connect middleware for express which means that it was always there, staring us right in the eye.

`webpack-dev-server` has:

```js
const historyApiFallback = require('history-api-fallback')

if(config.historyApiFallback) {
  // use this middleware
  app.use(historyApiFallback)
}
```

The express server has been setup today, it has not been tested yet, I realized that I needed to pass the hmr options to the config and not to the middleware, it would be used to generate the compiler and not for invoking the middleware. I did that and I added the config to a  server file, the middleware has been added to express.

An alternative approach involves setting it up yourself, take a look at react-router#676
I have decided to go with the history api fallback package, it seems to be quite stable and well maintained, in addition, glamorous requires glamor to be installed.(Done) 
