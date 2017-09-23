var onChange = require('object-change-callsite')
var nanologger = require('nanologger')

module.exports = debug

function debug (state, emitter, app) {
  var log = nanologger('choo-devtools')
  var enabled = false
  state = onChange(state, function (attr, value, callsite) {
    if (enabled) {
      log.info(`state.${attr}`, callsite + '\n', value)
    }
  })

  app.state = state

  return function () {
    enabled = true
  }
}
