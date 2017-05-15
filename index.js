'use strict';

const request = require('request');
const moment = require('moment-timezone');

module.exports.weather = weather;
function weather(event, context, callback) {

  // Translate Dark Sky icons to Slack emoji
  const icons = {
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

  const opts = {
    url: 'https://api.darksky.net/forecast/' + process.env.DarkSkySecretKey + '/' + process.env.Lat + ',' + process.env.Long,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request(opts, (err, res, body) => {
    if (err) return callback(err);
    let data = process.env.WeatherJSON ? JSON.parse(process.env.WeatherJSON) : JSON.parse(body);
    const hourly = data.hourly;
    const current = data.currently;
    let precipitation = 0;
    let itsNiceOut = false;
    let alerts;

    // Check if there will be snow over the next twelve hours
    for (let i = 0; i < 13; i++) {
      const hour = hourly.data[i];
      if (hour.precipType && hour.precipType == 'snow' && hour.precipAccumulation) {
        precipitation = precipitation + hour.precipAccumulation;
      }
    }
    precipitation = Math.ceil(precipitation * 100) / 100;

    const coolerMonths = [1, 2, 3, 4, 12];

    // Check if it's currently nice out
    if (current.temperature < 90 && current.precipProbability < .2) {
      if (coolerMonths.indexOf(moment().format('M')) !== -1) {
        // cooler months
        if (current.temperature >= 50) itsNiceOut = true;
      } else {
        // warmer months
        if (current.temperature >= 60) itsNiceOut = true;
      }
    }

    // Check if there are 'warning' or 'watch' severe weather alerts
    if (data.alerts) {
      alerts = data.alerts.filter((f) => {
        if (f.severity !== 'advisory') return f;
      });
    }

    if (precipitation > 1) {
      // --------------------
      //  Park the cars good
      // --------------------
      let message = 'We\'re expected to get *' + precipitation + ' inches* of snow over the next 12 hours. Park the cars good!';
      module.exports.post(message, ':snowflake:', callback);
    } else if (itsNiceOut) {
      // --------------------
      //      Go outside
      // --------------------
      let message = 'It\'s ' + Math.round(current.temperature) + '℉. Go outside!';
      module.exports.post(message, icons[current.icon], callback);
    } else if (alerts && alerts.length > 0) {
      // --------------------
      //      Alerts
      // --------------------
      let message = '';
      let alertSeverity = [];
      let alertEmoji = '';

      alerts.forEach((alert) => {
        message += '*' + alert.title + '* from ' + moment.unix(alert.time).tz(data.timezone).format('dddd (MM/DD) h:mm A') + ' until ' + moment.unix(alert.expires).tz(data.timezone).format('dddd (MM/DD) h:mm A') + ' ' + alert.uri + '\n';
        alertSeverity.push(alert.severity);
      });

      if (alertSeverity.indexOf('warning') > -1) alertEmoji = ':bangbang:';
      else if (alertSeverity.indexOf('watch') > -1) alertEmoji = ':exclamation:';
      else alertEmoji = ':grey_exclamation:';

      module.exports.post(message, alertEmoji, callback);
    } else {
      // --------------------
      //      Do nothing
      // --------------------
      return callback(null, 'No snow expected, it\'s not that nice out, and there are no weather alerts.');
    }
  });
}

/**
* Posts weather message to slack webhook URL.
*
* @function post
* @param {String} message - precipitation amount
* @param {Callback} callback - if error, returns error message; otherwise,
* returns request body
*/
module.exports.post = post;
function post(message, emoji, callback) {

  const json = {
    channel: process.env.SlackChannel,
    username: 'WeatherBot',
    icon_emoji: emoji,
    parse: 'full',
    text: message,
    markdown: true
  };

  request.post({
    url: process.env.SlackHookURL,
    json: json
  }, (err, resp) => {
    if (err) return callback(err);
    if (resp.statusCode !== 200) return callback(new Error('Got HTTP status ' + resp.statusCode + ' from slack'));
    return callback(null, 'Posted to Slack.');
  });
}