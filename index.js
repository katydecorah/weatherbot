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

  // Map Dark Sky icons with Slack emoji
  var icons = {
    'clear-day': ':sunny:',
    'clear-night': ':crescent_moon:',
    'partly-cloudy-day': ':partly_sunny:',
    'partly-cloudy-night': ':partly_sunny:',
    'cloudy': ':cloud:',
    'rain': ':rain_cloud:',
    'sleet': ':snow_cloud:',
    'snow': ':snowflake:',
    'wind': ':wind_blowing_face:',
    'fog': ':fog:'
  };

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
    var itsNiceOut = false;

    // Check if there will be snow over the next twelve hours
    for (var i = 0; i < 13; i++) {
      var hour = hourly.data[i];
      if (hour.precipType && hour.precipType == 'snow' && hour.precipAccumulation) {
        precipitation = precipitation + hour.precipAccumulation;
      }
    }
    precipitation = Math.ceil(precipitation * 100) / 100;

    // Check if it'll be nice out over the next hour
    for (var t = 0; t < 1; t++) {
      var hour = hourly.data[t];
      var temperature = hour.temperature;
      if (temperature > 50 && temperature < 90 && hour.precipProbability < .2) itsNiceOut = true;
    }

    if (precipitation > 1) {
      // --------------------
      //  Park the cars good
      // --------------------
      var message = 'We\'re expected to get *' + precipitation + ' inches* of snow over the next 12 hours. Park the cars good!';
      module.exports.post(channel, message, ':snowflake:', function(err, res) {
        console.log(res);
      });
    } else if (itsNiceOut) {
      // --------------------
      //      Go outside
      // --------------------
      var message = 'It\'s ' + Math.round(hourly.data[0].temperature) + '℉. Go outside!';
      module.exports.post(channel, message, icons[hourly.data[0].icon], function(err, res) {
        console.log(res);
      });
    } else {
      // --------------------
      //      Do nothing
      // --------------------
      console.log('No precipitation expected but also it\'s not that nice out.');
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
function post(channel, message, emoji, callback) {

  var json = {
    channel: channel,
    username: "WeatherBot",
    icon_emoji: emoji,
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