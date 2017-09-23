var copy = require('./lib/copy')
var log = require('./lib/log')

module.exports = expose

function expose () {
  return function (state, emitter) {
    emitter.on('DOMContentLoaded', function () {
      if (typeof window === 'undefined') return
      window.choo = {}

      window.choo.state = state
      window.choo.emit = function (eventName, data) {
        emitter.emit(eventName, data)
      }
      window.choo.on = function (eventName, listener) {
        emitter.on(eventName, listener)
      }

      window.choo.log = log(state, emitter)
      window.choo.copy = copy
    })
  }
}
