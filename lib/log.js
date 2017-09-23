var removeItems = require('remove-array-items')
var onIdle = require('on-idle')
var clone = require('clone')

var MAX_HISTORY_LENGTH = 150   // How many items we should keep around

module.exports = log

function log (state, emitter) {
  var history = []
  var i = 0

  window.choo._history = history
  window.choo.history = showHistory

  Object.defineProperty(window.choo, 'log', { get: showHistory })
  Object.defineProperty(window.choo, 'history', { get: showHistory })

  emitter.on('*', function (name, data) {
    i += 1
    var entry = new Event(name, data, state)
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
    var events = i === 1 ? 'event' : 'events'
    return `${i} ${events} recorded, showing the last ${MAX_HISTORY_LENGTH}`
  }
}

function Event (name, data, state) {
  this.name = name
  this.data = data
  this.state = clone(state)
}
