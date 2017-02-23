var request = require('request');
var fs = require('fs');

// set your incoming webhook
var slackURL = process.env.SlackHookURL;
// set your channel
var channel = process.env.SlackChannel || '@katydecorah';
// set your coordinates (lat,long)
var lat = process.env.Lat || '43.0833231';
var long = process.env.Long || '-73.8712154';

module.exports.weather = weather;
function weather(event, callback) {

  var opts = {
    url: 'https://api.darksky.net/forecast/' + process.env.DarkSkySecretKey + '/' + lat + ',' + long,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request(opts, function(err, res, body) {
    if (err) return callback(err);
    var data = JSON.parse(body);
    var hourly = data.hourly;
    var precipitation = 0;

    for (var i = 0; i < 13; i++) {
      var hour = hourly.data[i];

      if (hour.precipType && hour.precipType == 'snow' && hour.precipAccumulation) {
        precipitation = precipitation + hour.precipAccumulation;
      }
    }

    precipitation = Math.ceil(precipitation * 100) / 100;

    var message = 'We\'re expected to get *' + precipitation + ' inches* of snow over the next 12 hours. Park the cars good!';

    if (precipitation > 1) {
      module.exports.post(channel, message, function(err, res) {
        console.log(res);
      });
    } else {
      console.log('No precipitation expected.');
    }
  });
}

/**
* Posts weather message to slack webhook URL.
*
* @function post
* @param {String} channel - Slack channel to post text to
* @param {String} message - precipitation amount
* @param {Callback} callback - if error, returns error message; otherwise,
* returns request body
*/
module.exports.post = post;
function post(channel, message, callback) {

  var json = {
    channel: channel,
    username: "WeatherBot",
    icon_emoji: ":snowflake:",
    parse: "full",
    attachments: [
      {
        "fallback": "New message from WeatherBot!",
        "text": message,
        "mrkdwn_in": ["text"]
      }
    ]
  };

  request.post({
    url: slackURL,
    json: json
  }, function(err, resp) {
    if (err) return callback(err);
    if (resp.statusCode !== 200) return callback(new Error('Got HTTP status ' + resp.statusCode + ' from slack'));
    return callback(null, 'Posted to Slack.');
  });
}