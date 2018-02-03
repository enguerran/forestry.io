"use strict"
var atomicalgolia = require("atomic-algolia")
var deepmerge = require("deepmerge")
var request = require("request-promise-native")

module.exports = (context, cb) => {
  process.env = mergeEnv(context.secrets)

  var indexes = JSON.parse(process.env.INDEXES)

  indexes.forEach(function(index) {
    request({url: index.url, json: true})
      .then(function(data) {
        updateIndex(index.name, data, cb)
      })
      .catch(function(err) {
        cb(err)
      })
  })
}

var updateIndex = (indexName, data, cb) => {
  return atomicalgolia(indexName, data, {}, function(err, res) {
    if (err) cb(err)
    cb(null, res)
  })
}

var mergeEnv = (secrets) => {
  return deepmerge(process.env, secrets)
}
