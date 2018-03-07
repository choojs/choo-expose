var onPerformance = require('on-performance')

module.exports = perf

function perf (state, emitter, app, localEmitter) {
  var stats = {}

  window.choo.perf = {}

  // Print all events
  var all = new Perf(stats, 'all')
  Object.defineProperty(window.choo.perf, 'all', {
    get: all.get.bind(all),
    set: noop
  })

  // Print only Choo core events
  var core = new Perf(stats, 'core', function (name) {
    return /^choo/.test(name)
  })
  Object.defineProperty(window.choo.perf, 'core', {
    get: core.get.bind(core),
    set: noop
  })

  // Print component data
  var components = new Perf(stats, 'components', function (name) {
    return !/^choo/.test(name) && !/^bankai/.test(name)
  })
  Object.defineProperty(window.choo.perf, 'components', {
    get: components.get.bind(components),
    set: noop
  })

  // Print choo userland events (event emitter)
  var events = new Perf(stats, 'events', function (name) {
    return /^choo\.emit/.test(name)
  }, function (name) {
    return name.replace(/^choo\.emit\('/, '').replace(/'\)$/, '')
  })
  Object.defineProperty(window.choo.perf, 'events', {
    get: events.get.bind(events),
    set: noop
  })

  onPerformance(function (entry) {
    if (entry.entryType !== 'measure') return
    var name = entry.name.replace(/ .*$/, '')

    if (!stats[name]) {
      stats[name] = {
        name: name,
        count: 0,
        entries: []
      }
    }

    var stat = stats[name]
    stat.count += 1
    stat.entries.push(entry.duration)
  })
}

// Create a new Perf instance by passing it a filter
function Perf (stats, name, filter, rename) {
  this.stats = stats
  this.name = name
  this.filter = filter || function () { return true }
  this.rename = rename || function (name) { return name }
}

// Compute a table of performance entries based on a filter
Perf.prototype.get = function () {
  var filtered = Object.keys(this.stats).filter(this.filter)
  var self = this

  var fmt = filtered.map(function (key) {
    var stat = self.stats[key]
    var totalTime = Number(stat.entries.reduce(function (time, entry) {
      return time + entry
    }, 0).toFixed(2))
    var median = getMedian(stat.entries)
    var name = self.rename(stat.name)

    return new PerfEntry(name, totalTime, median, stat.count)
  })

  var res = fmt.sort(function (a, b) {
    return b['Total Time (ms)'] - a['Total Time (ms)']
  })
  console.table(res)
  return `Showing performance events for '${this.name}'`
}

// An entry for the performance timeline.
function PerfEntry (name, totalTime, median, count) {
  this['Name'] = name
  this['Total Time (ms)'] = totalTime
  this['Median (ms)'] = median
  this['Total Count'] = count
}

// Get the median from an array of numbers.
function getMedian (args) {
  if (!args.length) return 0
  var numbers = args.slice(0).sort((a, b) => a - b)
  var middle = Math.floor(numbers.length / 2)
  var isEven = numbers.length % 2 === 0
  var res = isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle]
  return Number(res.toFixed(2))
}

// Do nothing.
function noop () {}
