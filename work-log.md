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

I tried to run webpack without properly installing all my dependencies, I have setup my prev config which relied on having  access to babel config where babel transform plugins for template literals and classes need to be provided in order to enable hot reloading, we will see if that is nessecary in order to work with the package.

Also remember to install the `beta` version of `react-hot-loader`, otherwise, things will go to hell for you quite easily

Everything but webpack-dev-middleware works now, I can compiler my app using webpack, I have enabled `serverSideRender` with the middleware.
When this feature is added:

1. provides the `stats` required for server side rendering as `res.locals.webpackStats`

2. take the stats, convert it `toJSON()`, pick the `assetsByChunkName` from it, get assets by type
   and rener them using `res.send`

3.  also, do not forget to add `serverSideRender` as an option to the devMiddleware configuration and set the value to true

Having done all of this, I am confronted with an ugly reality, nothing works the first time and we as developers are too lazy to properly
read the docs and they as devs are too lazy to write good docs. Also, there might be certain issues which could be affecting us, are there
issues that need working around, are there errors in the stats that we seem to take for granted.

Resolving this issue will be the next step to nirvana
