var removeItems = require('remove-array-items')
var onIdle = require('on-idle')

var MAX_HISTORY_LENGTH = 150   // How many items we should keep around

module.exports = expose

function expose () {
  return function (state, emitter) {
    window.choo = {}
    window.choo.state = state
    window.choo.emit = function (eventName, data) {
      emitter.emit(eventName, data)
    }

    window.choo.on = function (eventName, listener) {
      emitter.on(eventName, listener)
    }

    var history = []
    var i = 0
    window.choo._history = history
    window.choo.history = showHistory
    Object.defineProperty(window.choo, 'log', { get: showHistory })
    Object.defineProperty(window.choo, 'history', { get: showHistory })

    emitter.on('*', function (name, data) {
      i += 1
      var entry = new Event(name, data)
      history.push(entry)
      onIdle(function () {
        var length = history.length
        if (length > MAX_HISTORY_LENGTH) {
          removeItems(history, 0, length - MAX_HISTORY_LENGTH)
        }
      })
    })

    function showHistory () {
      console.table(history)
      return i + ' events recorded, showing the last ' + MAX_HISTORY_LENGTH
    }
  }
}

function Event (name, data) {
  this.name = name
  this.data = data
}
