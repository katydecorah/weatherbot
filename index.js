'use strict';

const request = require('request');
const _ = require('underscore');
const moment = require('moment-timezone');

const weather = (event, context, callback) => {
  module.exports
    .getWeather()
    .then(module.exports.getMessage)
    .then(module.exports.post)
    .then(data => callback(null, data))
    .catch(err => callback(err));
};

const getWeather = () => {
  const opts = {
    url: `https://api.darksky.net/forecast/${process.env.DarkSkySecretKey}/${
      process.env.Lat
    },${process.env.Long}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err) reject(err);
      resolve(
        process.env.WeatherJSON
          ? JSON.parse(process.env.WeatherJSON)
          : JSON.parse(body)
      );
    });
  });
};

const post = message => {
  const json = {
    channel: process.env.SlackChannel,
    username: 'WeatherBot',
    icon_emoji: message ? message.icon : '',
    parse: 'full',
    text: message ? message.message : '',
    markdown: true
  };

  return new Promise((resolve, reject) => {
    if (message) {
      request.post(
        {
          url: process.env.SlackHookURL,
          json: json
        },
        (err, resp) => {
          if (err) reject(err);
          if (resp.statusCode !== 200)
            reject(`Got HTTP status ${resp.statusCode} from Slack`);
          resolve('Posted to Slack.');
        }
      );
    } else {
      resolve(
        "No snow expected, it's not that nice out, and there are no weather alerts."
      );
    }
  });
};

const getIcon = icon => {
  const icons = {
    'clear-day': ':sunny:',
    'clear-night': ':crescent_moon:',
    'partly-cloudy-day': ':partly_sunny:',
    'partly-cloudy-night': ':partly_sunny:',
    cloudy: ':cloud:',
    rain: ':rain_cloud:',
    sleet: ':snow_cloud:',
    snow: ':snowflake:',
    wind: ':wind_blowing_face:',
    fog: ':fog:'
  };
  return icons[icon];
};

const getPrecipitation = hourly => {
  const data = hourly.data.slice(0, 13);
  const precipitation = data.reduce((precipitation, hour) => {
    if (
      hour.precipType &&
      hour.precipType == 'snow' &&
      hour.precipAccumulation
    ) {
      return precipitation + hour.precipAccumulation;
    } else {
      return precipitation;
    }
  }, 0);
  if (precipitation > 1) {
    return {
      message: `We're expected to get *${Math.ceil(precipitation * 100) /
        100} inches* of snow over the next 12 hours. Park the cars good!`,
      icon: ':snowflake:'
    };
  }
};

const checkItsNiceOut = current => {
  const coolerMonths = [1, 2, 3, 4, 12];
  let itsNiceOut = false;
  // Check if it's currently nice out
  if (current.temperature < 81 && current.precipProbability < 0.2) {
    if (coolerMonths.indexOf(moment().format('M')) !== -1) {
      // cooler months
      if (current.temperature >= 50) itsNiceOut = true;
    } else {
      // warmer months
      if (current.temperature >= 60) itsNiceOut = true;
    }
  }
  return itsNiceOut
    ? {
        message: `It's ${Math.round(current.temperature)}℉. Go outside!`,
        icon: module.exports.getIcon(current.icon)
      }
    : '';
};

const getAlerts = data => {
  if (data.alerts) {
    const alerts = data.alerts.filter(f => {
      if (f.severity !== 'advisory') return f;
    });
    return module.exports.getAlertDetails(alerts, data);
  } else return null;
};

const getAlertDetails = (alerts, data) => {
  const alertSeverity = _.pluck(alerts, 'severity');
  const message = alerts.map(alert => {
    return (
      '*' +
      alert.title +
      '* from ' +
      moment
        .unix(alert.time)
        .tz(data.timezone)
        .format('dddd (MM/DD) h:mm A') +
      ' until ' +
      moment
        .unix(alert.expires)
        .tz(data.timezone)
        .format('dddd (MM/DD) h:mm A') +
      ' ' +
      alert.uri +
      '\n'
    );
  });

  let alertEmoji = ':grey_exclamation:';
  if (alertSeverity.indexOf('warning') > -1) alertEmoji = ':bangbang:';
  else if (alertSeverity.indexOf('watch') > -1) alertEmoji = ':exclamation:';

  return {
    message: message.join(''),
    icon: alertEmoji
  };
};

const getMessage = data => {
  return new Promise(resolve => {
    // is it snowing?
    const precipitation = module.exports.getPrecipitation(data.hourly);
    // is it nice out?
    const itsNiceOut = module.exports.checkItsNiceOut(data.currently);
    // are there weather alerts?
    const alerts = module.exports.getAlerts(data);

    if (precipitation && precipitation.message) resolve(precipitation);
    else if (itsNiceOut && itsNiceOut.message) resolve(itsNiceOut);
    else if (alerts && alerts.message) resolve(alerts);
    else resolve(null);
  });
};

module.exports = {
  weather,
  getWeather,
  post,
  getIcon,
  getPrecipitation,
  checkItsNiceOut,
  getAlerts,
  getAlertDetails,
  getMessage
};
