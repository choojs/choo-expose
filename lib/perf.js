var onPerformance = require('on-performance')

module.exports = perf

function perf (state, emitter, app, localEmitter) {
  var stats = {}

  window.choo.stats = function () {
    var fmt = Object.keys(stats).map(function (key) {
      var stat = stats[key]
      var totalTime = Number(stat.entries.reduce(function (time, entry) {
        return time + entry
      }, 0).toFixed(2))
      var median = getMedian(stat.entries)
      return new PerfEntry(stat.name, totalTime, median, stat.count)
    })

    var res = fmt.sort(function (a, b) {
      return b['Total Time (ms)'] - a['Total Time (ms)']
    })
    console.table(res)
  }

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

function PerfEntry (name, totalTime, median, count) {
  this['Name'] = name
  this['Total Time (ms)'] = totalTime
  this['Median (ms)'] = median
  this['Total Count'] = count
}

function getMedian (args) {
  if (!args.length) return 0
  var numbers = args.slice(0).sort((a, b) => a - b)
  var middle = Math.floor(numbers.length / 2)
  var isEven = numbers.length % 2 === 0
  var res = isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle]
  return Number(res.toFixed(2))
}
