'use strict';

// define our Cache functionality
module.exports = function Cache(config) {

  // import the Redis module
  // this will make the necessary network calls to send our commands to the Redis database
  var redis = require('redis');

  // create the Redis client with the appropriate configuration options to connect
  var redisClient = redis.createClient(config.port, config.host, config.options);

  var CACHE_TTL = 30; // expire in 30 seconds

  // create a function to get the twitter query value
  this.get = function(query, callback) {

    // issue a GET command to Redis using the query as the key
    // see: http://redis.io/commands/get
    redisClient.get(query, function(err, results) {

      if (err) { return cb(err); }
      callback(null, JSON.parse(results));
    });
  };

  // create a function that sets the result into the database using query as the key
  this.set = function(query, results, callback) {

    // convert the results object to a string
    results = JSON.stringify(results);

    // call Redis to set the value and set a TTL on the key
    // this is the same as calling SET followed by EXPIRE, but is atomic
    // see: http://redis.io/commands/setex
    redisClient.setex(query, CACHE_TTL, results, callback);
  };
};
