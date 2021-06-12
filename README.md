# TideBitWallet
Chrome Extension for TideWallet3

### setup
1. Open the Extension Management page in Chrome
```
chrome://extensions
```

2. Enable Developer Mode & Click on LOAD UNPACKED

3. Find the Extension Box for successful installation



report errtor
```
Uncaught EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
```
Took me a few hours but what you probably want to do is change the style of source mapping webpack uses. By default it uses eval.

[the way to solve](https://webpack.js.org/configuration/devtool/)

I added this to my webpack.config.js: 
devtool: 'cheap-module-source-map'

The trick to this was figuring out why webpack --mode development has the error and webpack --mode production didn't.

[where I find it](https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error)
