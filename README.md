# Eval Webpack Plugin

Create an in-memory webpack module by evaluating a function.

This plugin will re-run the function on a configurable `pollInterval`, invalidating the compilation and triggering a reload if the return value has changed.

The return value must be JSON-stringifyable.

## Example

```js
const EvalWebpackPlugin = require("eval-webpack-plugin");

// ...

plugins: [
  EvalWebpackPlugin("./example.js", () => 42),
  // We can then write require("./example.js") to access the value 42
];

// ...
```

### Related

- https://github.com/kentcdodds/babel-plugin-preval
- https://github.com/webpack-contrib/val-loader
