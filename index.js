'use strict';

var config = require('./config'); // be sure to set your values in this file!

var Twitter = require('./twitter');
var twitter = new Twitter(config);

var queryString = process.argv[2];

twitter.query(queryString, function(err, results) {
  if (err) { throw err; }

  results.statuses.forEach(function(status) {
    console.log('%s : %s', status.user.screen_name, status.text);
  });

  process.exit(0);
});
