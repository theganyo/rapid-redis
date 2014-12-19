/****************************************************************************
 Copyright (c) 2014, Scott Ganyo <scott@ganyo.com>

 Permission to use, copy, modify, and/or distribute this software for any
 purpose with or without fee is hereby granted, provided that the above
 copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 PERFORMANCE OF THIS SOFTWARE.
 ****************************************************************************/
'use strict';

// define our Twitter functionality
// including setting and retrieving values from the cache as needed
module.exports = function Twitter(config) {

  // ensure we've set up the config file
  checkConfig(config);

  // import the Twit module to make the network calls to Twitter
  var Twit = require('twit');

  // import our cache functions to cache and retrieve our cached results
  var Cache = require('./cache');

  // create the connection to Twitter
  this.twit = new Twit(config.twitter);

  // create the Cache
  this.cache = new Cache(config.redis);

  // a function that queries Twitter without going through the cache
  this.queryNoCache = function(query, callback) {

    var twitQuery = { q: process.argv[2], count: 10 };

    this.twit.get('search/tweets', twitQuery, callback);
  };

  // a function that queries Twitter if nothing found in the cache
  this.cachedQuery = function(query, callback) {

    var self = this;
    var cacheKey = makeCacheKey(query);

    // retrieve results from cache
    self.cache.get(cacheKey, function(err, results) {

      if (err || results) {
        console.log('result from cache');
        return callback(err, results);
      }

      // retrieve results from twitter
      self.queryNoCache(query, function(err, results) {

        if (err || !results) { return callback(err); }

        console.log('result direct from twitter');

        // set the results in the cache
        self.cache.set(cacheKey, results, function(err) {
          callback(err, results);
        });
      });
    });
  };

  // export cachedQuery function as query
  this.query = this.cachedQuery;

  // print an error an exit if config hasn't been setup
  function checkConfig(config) {
    if (config.twitter.consumer_key === '') {
      console.log('Please set your keys in config.js before running.');
      process.exit(1);
    }
  }

  // create a compound key for the Cache using the Query
  function makeCacheKey(query) {
    return 'twitter:cache:' + query;
  }
};
