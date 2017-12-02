#!/usr/bin/env node

const weatherbot = require('../index.js');
const argv = require('minimist')(process.argv.slice(2));

if (!argv.channel && !argv.lat && !argv.long) {
  console.log(
    'Usage:   weatherbot --channel=<channel> --lat=<latitude> --long=<longitude>'
  );
  console.log(
    'Example: weatherbot --channel=@katydecorah --lat=43.0833231 --long=-73.8712154'
  );
  process.exit(1);
}

process.env.SlackChannel = argv.channel;
process.env.Lat = argv.lat;
process.env.Long = argv.long;

weatherbot.weather({}, null, (err, callback) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(callback);
});
