var test = require('tape')
var choo = require('choo')
var devtools = require('../')
var proxyquire = require('proxyquire')

test('Aggregate logs before printing to console', function (t) {
  var app = choo()
  app.use(devtools({
    // TODO: Before merge ->
    // This isn't really a filter so much as a function that decides whether to
    //
    // 1. do nothing
    // 2. Log stuff
    //
    // Figure our a better name for this.
    filter: function (eventName, data, timing) {
      return [
        [
          {name: 'Some repetitive event', data: {data: '1'}, timing: someOldTiming1},
          {name: 'Some repetitive event', data: {data: '2'}, timing: someOldTiming2},
          {name: 'Some repetitive event', data: {data: '3'}, timing: someOldTiming3},
        ],
        {name: 'Most recent event', data: {some: 'data'}, timing: timing}
      ]
    }
  }))

  app.use(function (state, emitter) {
    // We define an event so that when we emit it our `hook.on('event')`
    // listener gets called.
    app.emitter.on('foo', function () {
      console.log('some app.emitter called')
    })
  })

  app.route('*', function () {
    return 'Need to call `toString*()` for the app to start so need a route.'
  })
  app.toString('/')

  app.emitter.emit('foo', {event: 'data'})

  t.end()
})
