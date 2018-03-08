var EventEmitter = require('events').EventEmitter
var window = require('global/window')

var storage = require('./lib/storage')
var logger = require('./lib/logger')
var debug = require('./lib/debug')
var copy = require('./lib/copy')
var help = require('./lib/help')
var log = require('./lib/log')
var getAllRoutes = require('wayfarer/get-all-routes')

module.exports = expose

function expose () {
  store.storeName = 'choo-devtools'
  return store
  function store (state, emitter, app) {
    var localEmitter = new EventEmitter()

    // We should start the logger before DOM is loaded.
    // FIXME: Ask a choo-devtools maintainer what this is for
    if (typeof window !== 'undefined') {
      console.log('logger started')
      logger(state, emitter, app)
    }

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

      debug(state, emitter, app, localEmitter)

      log(state, emitter, app, localEmitter)
      window.choo.copy = copy
      if (app.router && app.router.router) {
        window.choo.routes = Object.keys(getAllRoutes(app.router.router))
      }

      storage()
      help()
    })
  }
}
