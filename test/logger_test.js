var test = require('tape')
var choo = require('choo')
var devtools = require('../')
var proxyquire = require('proxyquire')
// var devtools = proxyquire('../', {
//   ch
// })


test('Aggregate logs before printing to console', function (t) {
  var app = choo()
  app.use(devtools())

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
