'use strict';

// import our configuration
// be sure to set your values in this config file!
var config = require('./config');

// import our Twitter functions
var Twitter = require('./twitter');
var twitter = new Twitter(config);

// get the query string specified in the terminal command
var queryString = process.argv[2];

// send the query to our Twitter query function (which will also perform caching)
twitter.query(queryString, function(err, results) {
  if (err) { throw err; }

  // print out the results of the Twitter query (or cache result)
  results.statuses.forEach(function(status) {
    console.log('%s : %s', status.user.screen_name, status.text);
  });

  // exit the script
  process.exit(0);
});
