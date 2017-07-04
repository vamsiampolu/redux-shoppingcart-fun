Plan: Get started with a minimal webpack config. Dont worry about loading css with a css-loader or something of that sort, I will rely on glamorous for this project and see what that gives me. Another option would be to completely skip over webpack and use rollup because it understands ES6, creates a lean bundle and does tree shaking by  default with almost no configuration.

I would have to check to see if rollup has any support for hot module reloading and applying hot updates. We are back to webpack.
