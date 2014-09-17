'use strict';

module.exports = function Twitter(config) {
  checkConfig(config);

  var Twit = require('twit');
  var Cache = require('./cache');

  this.twit = new Twit(config.twitter);
  this.cache = new Cache(config.redis);

  this.queryNoCache = function(query, callback) {

    var twitQuery = { q: process.argv[2], count: 10 };

    this.twit.get('search/tweets', twitQuery, callback);
  };

  this.cachedQuery = function(query, callback) {

    var self = this;
    var cacheKey = cacheKey(query);

    self.cache.get(cacheKey, function(err, results) {

      if (err || results) {
        console.log('result from cache');
        return callback(err, results);
      }

      self.queryNoCache(query, function(err, results) {

        if (err || !results) { return callback(err); }

        console.log('result direct from twitter');

        self.cache.set(cacheKey, results, function(err) {
          callback(err, results);
        });
      });
    });
  };

  this.query = this.cachedQuery;

  function checkConfig(config) {
    if (config.twitter.consumer_key === '') {
      console.log('Please set your keys in config.js before running.');
      process.exit(1);
    }
  }

  function cacheKey(query) {
    return 'twitter:cache' + query;
  }
};
