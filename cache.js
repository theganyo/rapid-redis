'use strict';

module.exports = function Cache(config) {

  var redis = require('redis');

  var redisClient = redis.createClient(config.port, config.host, config.options);
  var CACHE_TTL = 30000;

  this.get = function(query, callback) {

    redisClient.get(query, function(err, results) {

      if (err) { return cb(err); }
      callback(null, JSON.parse(results));
    });
  };

  this.set = function(query, results, callback) {

    results = JSON.stringify(results);

    redisClient.psetex(query, CACHE_TTL, results, callback);
  };
};
