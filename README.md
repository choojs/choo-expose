# choo-expose [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Expose a choo instance on the window

## Usage
```js
var expose = require('choo-expose')
var choo = require('choo')

var app = choo()
app.use(expose())

console.log(window.choo.state)
window.choo.emit('foo')
window.choo.on('foo', function (data) {
  console.log('foo called', data)
})

window.choo.log
// => table view of history
```

## API
### `instance = expose()`
Create a new `choo-expose` instance.

### `window.choo.state`
Get the current state.

### `window.choo.log`
### `window.choo.history`
Get an overview of the most recent events.

### `window.choo.copy`
Serialize an object into JSON and copy it to the clipboard.
Must be called in response to a user gesture event, like click or keyup.

Example:

#### copy whole choo state to clipboard

```js
window.addEventListener('keyup', function (e) {
  // press 'c' to copy current state to clipboard
  if (e.keyCode === 67) {
    window.choo.copy()
  }
})
```

#### copy choo state at a specific path

```js
window.addEventListener('keyup', function (e) {
  // press 'c' to copy current state at a specific path
  if (e.keyCode === 67) {
    window.choo.copy('state.foo.bar')
  }
})
```

```js
// also works with nested paths such as:
var object = { hello: { world: { lorem: 'ipsum' } } }
window.choo.copy('hello.world.lorem', object)
// will copy 'ipsum' to clipboard

// and objects:
window.choo.copy({cool: 'hey'})
// will copy {'cool': 'hey'} to clipboard
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-expose.svg?style=flat-square
[3]: https://npmjs.org/package/choo-expose
[4]: https://img.shields.io/travis/yoshuawuyts/choo-expose/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/choo-expose
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/choo-expose/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/choo-expose
[8]: http://img.shields.io/npm/dm/choo-expose.svg?style=flat-square
[9]: https://npmjs.org/package/choo-expose
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
