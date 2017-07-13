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

This project's stated goal was to work on React, I have spent a  long time working on webpack, webpack is a dream killing machine that accepts time and returns cryptic errors, giant configuration files that need to be broken down into smaller pieces, options that dont make sense and features that we dont even need.

I added the module.hot flag to try and fix the issue occuring with react-hot-loader/patch which was complaining the `development` was not defined.
Changing the order of reactHotLoader and webpackHmr entries did not affect the output much, there was no change to the error, it might be an incompatibility between the middleware and react-hot-loader.

I just have the server working correctly with server rendering config from the webpack-dev-middleare although no output can be displayed, it can be a publicPath issue. I got the code working with the node debugger's support. I have to take this slow and keep debugging. 

This gives me a new error:

> the first error is caused by the react-hot-loader/patch entry

```
  Uncaught ReferenceError: development is not defined
  at Object.<anonymous> (patch.js:5)
  at __webpack_require__ (bootstrap 156c1de…:661)
  at fn (bootstrap 156c1de…:87)
  at Object.<anonymous> (patch.js:1)
  at __webpack_require__ (bootstrap 156c1de…:661)
  at fn (bootstrap 156c1de…:87)
  at Object.options.path (AppContainer.js:9)
  at __webpack_require__ (bootstrap 156c1de…:661)
at validateFormat (bootstrap 156c1de…:707)
  at bundle.js:711

20:42:34.199 localhost/:1 EventSource's response has a MIME type ("text/html") that is not "text/event-stream". Aborting the connection.
20:43:54.928 :3000/__webpack_hmr:1 GET http://localhost:3000/__webpack_hmr net::ERR_EMPTY_RESPONSE
20:44:26.174 localhost/:1 EventSource's response has a MIME type ("text/html") that is not "text/event-stream". Aborting the connection.
```

8 July 2017

I found that the [issue](https://github.com/glenjamin/webpack-hot-middleware/issues/26) was really helpful when trying to solve the issue, I removed the path config, heartbeat and timeout for the `webpack-hot-middleware` config and added the `historyFallbackApi` immediately after, it solved the issue for me.

The `react-hot-loader` troubleshooting guide asks to exclude node_modules and include only app when working with it in the [Troubleshooting guide](https://github.com/gaearon/react-hot-loader/blob/master/docs/Troubleshooting.md), still the error persists.

**Assemble the failed pieces of code here from the stacktrace**

The stuff that comes before it is just webpack trying to resolve the request, I am using the `webpack-hot-middleware`, so it calls:

```
return hotCreateRequire(136)(__webpack_require__.s = 136);
```

`react-hot-loader/patch is part of the entry and was imported


this was called inside `react-hot-loader/patch`:

```js
if (!module.hot || process.env.NODE_ENV === 'production') {
  module.exports = require('./patch.prod');
} else {
  module.exports = require('./patch.dev');
}
```

Removing `static` middleware for serving assets changes the error, which is good, it means that we dont download the `bundle` correctly anymore, it might purely be due to the middleware ordering(??). A copy of the error here:

> 06:11:41.652 bundle.js:2 Uncaught SyntaxError: Unexpected token <

I am working with little or limited information, often finding myself unwilling or incapable of obtaining more, re-ordering the middleware is an idiotic idea and ofcourse it does not work, I tried disabling the `historyApiFallback and it does not work either, we need to be able to have a `public dir` and `express.static`, then the question is WHY?, is server side render option from webpack-dev-middleware not working, it considers the html as a bundle.

Is it the middleware configuration, take a look at the readme of webpack-dev-middleware again, it looks no different. It looks like `serverSideRender and static middleware are not playing well together:

```
app.use(express.static(__dirname + '/public')) // could this be due to publicPath being a value of  '/assets/'
app.use((req, res) => {
    const stats = res.locals.webpackStats.toJson()
    const assets = normalizeAssets(stats.assetsByChunkName.main)
    const styles = getLinks(assets)
    const scripts = getScripts(assets)
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
```
9 Jul 2017

throws `development` is not defined, the other way around throws `< cannot be parsed` because html is sent down as javascript.
I tried adding a `development` env flag for react-hot-loader in `.babelrc`. It has caused no effect so far when I tried to use it as:


```
node server.js
NODE_ENV=development node server.js
```

I have barely got it working, a problem cannot be solved only until a stackoverflow question or a github issue is created. However, it relies on ``express.static` instead of relying on `serverSideRender` from `webpack-dev-middleware`.

I also find that `HMR` is not working correctly, it shows me the issue:

```
[HMR] connected
15:39:36.213 process-update.js:27 [HMR] Checking for updates on the server...
15:39:36.230 process-update.js:81 [HMR] The following modules couldn't be hot updated: (Full reload needed)
This is usually because the modules which have changed (and their parents) do not know how to hot reload themselves. See http://webpack.github.io/docs/hot-module-replacement-with-webpack.html for more details.
logUpdates @ process-update.js:81
applyCallback @ process-update.js:49
(anonymous) @ process-update.js:57
15:39:36.230 process-update.js:89 [HMR]  - ./src/app.js
(anonymous) @ process-update.js:89
logUpdates @ process-update.js:88
applyCallback @ process-update.js:49
(anonymous) @ process-update.js:57
15:39:37.640 client.js:200 [HMR] bundle rebuilding
15:39:37.855 client.js:208 [HMR] bundle rebuilt in 196ms
```

This means that `webpack-hot-middleware` is working correctly, however, it does not seem to/want to work with react-hot-loader due to the way it has been configured.

I think having `serverSideRender` with `webpack-dev-middleware` would be more interesting, so I will try and remove `static middleware and try to fix the issue

Exciting news, there is server side rendering in a template, beyond that there is very sad news, it seems to be rendering the output of the `ejs` template directly into the html as strings, so it is a template issue that `CAN BE FIXED`. <Appropriate celebratory emoji goes here>

Time to read the ejs docs(for the first time), and it WORKS, it works, YES!!!, I had to use `<%- %>` to enclose my markup instead of `<%= %>` which escapes the HTML.

I have picked a  css framework that I want to use in my app, only instead of using it as css, we going css-in-js, with server rendering <sweating profusely>, the framework I picked is called milligram. I am going to take its grid and use it as required, also I will try and avoid using css shorthand syntax and explicitly add properties where required so that it is easy for me to read.

I have created styling using `glamorous` but it does not work because we need server rendering with css either inline or in a link tag, so I need to do server rendering for the css-in-js library

10 July 2017

Apologies for the delay in publishing this work-log, yesterday I managed to get almost EVERYTHING(tm) working, by that I mean:

1. the server side rendering of css-in-js using glamor works, in order to get this working, I downgraded glamor to v2, it looks like v3 is in progress and is using/going-to-use a seperate package called `glamor-server`. Then I retrieved the styling from it using the code snippet:

```js
const {html, css, ids} = renderStatic(() => renderToString(<App />))
```

Just dump the css into the ejs template, which is easy enough, the ids also need to be in the template, this is used by glamor when it tries to generates css again and matches the ids and stands down allowing a single render instead of a double render on the client. However, on order for this to happen there is another piece of the puzzle that needs to be in place:

```html
<script type="text/javascript">
  window._glam = JSON.stringify(<%= ids %>)
</script>
```

> Values enclosed within `<%= %>` are evaluated and escaped for html

In the `index` client file which is rendered, use:

```js
import {rehydrate} from 'glamor'

const renderWithHmr = Component => {
  rehydrate(window._glam)
    render(<AppContainer><Component /></AppContainer>, app)
}
```

After doing this, I came across the `compose` function from the strangely named `recompose`, a utility belt library for `React`, it looked like this, I copied it over in a haze into a utils directory and caught the functional programming in JS bug, in this sickness, I did some changes to the server.js file that might be of interest to you:

**Original**

```js
const assets = normalizeAssets(stats.assetsByChunkName.main)		 +  const assets = assetsFromStats(stats)
const styles = getLinks(assets)		 
const {scripts, styles} = assets
const scripts = getScripts(assets)
debugger
const fnForGlamor = makeFnForGlamor(App)
const html = renderToString(<App />)
const {html, css, ids} = renderStatic(fnForGlamor)
const locals = {scripts, styles, html}
const locals = {scripts, styles, css, ids, html}
res.render('index', locals)
```

**Functional**

```js
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
```

Then we go ahead and call this:

```
const stats = res.locals.webpackStats.toJson()
const assets = assetsFromStats(stats)
const {scripts, styles} = assets

const fnForGlamor = makeFnForGlamor(App)
const {html, css, ids} = renderStatic(fnForGlamor)
```

From the fevered scrawling of the author:

My evil plan is to use rabid functional programming has been foiled first by `webpack-dev-middleware` which is bound to a context and performs internal mutations on its environment, thus making it nessecary for us to call `toJson` as is, if not it throws an error requiring that the context not be undefined.

Also, glamor does not provide support for easy use within a compose function because it is a function that accepts a function, I tried to encapsulate it within a pure function:

```js
const makeFnForGlamor = App => () => simpleSSR(App)
```

which is then passed to `glamor`.

I have noticed that as soon as you use the `.` operator, it becomes slightly harded to make your code functional, I try and use destructuring as much as possible to avoid accidental use of this operator as a setter instead of  a getter. Also, the use of this is a screw-you to anybody attempting to use your API in a functional style.

Also, we notice that when we call a method on an object or an array, it operates under the assumption that it already knows the data, it will prevent the function first style of using higher order functions and optimizations for using pure functions, FP and OOP are not buddies, if you structure your API  a certain way, you are locked into it.

Then I went on to add row and container to milligram, a css framework

11 July 2017

I created milligram column as well, while doing this I noticed a few things.

Interestingly milligram does not specify meida query driven column sizes for display different styles of content for different viewports, instead it just relies on the user to do so. I believe this is to keep it minimal. A confusing aspect of using milligram is that it specifies row and column sizes in percent but instead of allowing users to specify any value between 0-100, it enforces values of its own such as `33, 34` and so on. It is a misfit in both ways as css framework.

I had to rewrite the row and column to mutate the object as options were  verified and properties were added because it is idiomatic Javascript:

**Bad**

```js
const oldRow = row
row = {
  ...oldRow,
  [newProp]: newPropValue
}
```

**Good**

```js
row.newProp = newPropValue
```

we can think about objects of data as single argument functions, in order to do so, one must also have appropriate error handling as or in addition to a default case. I found that a switch case was easier to understand in this case:

**Bad**

```js
const alignmentConverter = {
  top: {alignItems: 'flex-start'},
  bottom: {alignItems: 'flex-end'},
  center: {alignItems: 'center'},
  stretch: {alignItems: 'stretch'},
  baseline: {alignItems: 'baseline'}
  }
  const oldRow = row
  row = {
    ...oldRow,
    ...alignmentConverter[alignment]
  }
```

**Good**

```js
switch (alignment) {
  case 'top':
    row.alignItems = 'flex-start'
      break
  case 'bottom':
      row.alignItems = 'flex-end'
        break
  case 'center':
        row.alignItems = 'center'
          break
  case 'stretch':
          row.alignItems = 'stretch'
            break
  case 'baseline':
            row.alignItems = 'baseline'
              break
  default:
              throw new Error(
                  `The value provided for alignment must be one of ${JSON.stringify(ROW_ALIGNMENT_VALUES)}, instead you provided ${alignment}`
                  )
}
```

Another interesting thing about milligram is that it uses a default font size of 10px instead of the standard 16px.

I have added the flexboxgrid styling as javascript in the file utils/box.js, the next step is to build a demo of how flexbox is implemented by milligram, I introduced glamorous and created components for each of these boxes. I have noticed that each box relies on a base box style before it adds a few additional rules for its style.

I also see the `glamorous` or `styled-components` side of the argument where they take away the awkward side of the wiring up of classNames and styles for components using glamor. With ease-of-use comes the inablility to inspect the output using anythingbut snapshots, this makes it a little awkward but they do solve a problem.

Is this a good use case for theming with glamor/glamorous?

Another thing that would be rather interesting to accomplish would be setting up `jest` for a project from scratch so that I can do unit testing and snapshots for when a component is done.

Setting up jest for unit testing to avoid inertia and sloppy coding practices is a priority, I have decided to work on this first instead of working on theming of the boxes.

I have installed jest and its dependencies:

  1. jest
  2. babel-jest
  3. regenerator-runtime
  4. babel-plugin-transform-es2015-modules-commonjs

> I have also setup the `modules: false` when working with the `babel-preset-env`.

I also pre-emptively set up:

  1. babel-plugin-syntax-dynamic-import
  2. babel-plugin-dynamic-import-node

> AND I thought JAVA class names were long and unwieldy, sigh

Now, we need to get webpack and jest to play well with one another, they have a nice configuration guide
