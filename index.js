var debug = require('./lib/debug')
var copy = require('./lib/copy')
var log = require('./lib/log')

module.exports = expose

function expose () {
  return function (state, emitter, app) {
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

      Object.defineProperty(window.choo, 'debug', debug(state, emitter, app))

      window.choo.log = log(state, emitter)
      window.choo.copy = copy
    })
  }
}
