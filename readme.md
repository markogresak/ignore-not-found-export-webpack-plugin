# IgnoreNotFoundExportPlugin [![Build Status](https://travis-ci.com/markogresak/ignore-not-found-export-webpack-plugin.svg?branch=master)](https://travis-ci.com/markogresak/ignore-not-found-export-webpack-plugin)

> Ignore webpack export not found warnings

## Install

```
$ npm install --save-dev ignore-not-found-export-webpack-plugin
```

## Usage

:warning: This plugin can remove useful info about missing imports, which might deteriorate the development experience. Be careful with how you configure this plugin.

```js
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-webpack-plugin');

module.exports = {
  plugins: [new IgnoreNotFoundExportPlugin(options)],
  // ...
};
```

## API

### IgnoreNotFoundExportPlugin([options])

#### options

Type: `Object`

##### `include`

Type: `RegExp|RegExp[]`<br>
Default: `/./` (allow any path)

A regular expression or an array of regular expressions of import paths to include.

Example:

- `[/\.tsx?$/]`: ignore warnings only for imported `.ts` or `.tsx` files. Useful if re-exporting TypeScript `interface` (reference: [webpack#7378](https://github.com/webpack/webpack/issues/7378), [ts-loader#653](https://github.com/TypeStrong/ts-loader/issues/653))

## Credit

[@Strate](https://github.com/Strate) for [the idea and initial implementation](https://github.com/TypeStrong/ts-loader/issues/653#issuecomment-390889335).

## License

MIT © [Marko Grešak](https://gresak.io)
