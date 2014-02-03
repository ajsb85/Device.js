Device.js
=========

Device.js is mobile device spec database.

# API Document

- https://github.com/uupaa/Spec.js/wiki/Spec
- https://github.com/uupaa/Device.js/wiki/Device
- https://github.com/uupaa/DeviceQuery.js/wiki/DeviceQuery
- https://github.com/uupaa/Browser.js/wiki/Browser
- https://github.com/uupaa/OS.js/wiki/OS

# Install, Setup modules

```sh
$ brew install closure-compiler

$ git clone git@github.com:uupaa/Device.js.git
$ cd Device.js
$ npm install
```

# Minify

```sh
$ npm start

  or

$ node node_modules/uupaa.minify.js --keep --output ./lib/Device.min.js ./lib/Device.js
```

## cutoff @node, @androidjp, @windowsphone
Remove unused code blocks.

```sh
$ node node_modules/uupaa.minify.js --keep --output ./lib/Device.min.js ./lib/Device.js @node @androidjp @windowsphone
```

```js
//{@node
  ...
//}@node

//{@androidjp
  ...
//}@androidjp

//{@windowsphone
  ...
//}@windowsphone
```

# Test

```sh
$ npm test
```

