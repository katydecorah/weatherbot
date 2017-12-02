'use strict';

const weatherbot = require('../index.js');
const test = require('tape');

const data = require('./fixtures/success.json');
test('[weatherbot] success, go outside', assert => {
  process.env.SlackChannel = 'test-channel';
  process.env.SlackHookURL = 'http://test.hook.com';
  process.env.WeatherJSON = JSON.stringify(data);

  const originalPost = weatherbot.post;
  weatherbot.post = message => {
    assert.equal(message.message, "It's 71℉. Go outside!");
    assert.equal(message.icon, ':cloud:');
    return new Promise(resolve => {
      resolve('success');
    });
  };

  weatherbot.weather({}, null, (err, res) => {
    assert.ifError(err, 'Should not error');
    assert.deepEqual(
      res,
      'success',
      'Success message from post() should appear in callback'
    );
    weatherbot.post = originalPost;
    assert.end();
  });
});

const alert = require('./fixtures/alert.json');
test('[weatherbot] success, alert', assert => {
  process.env.SlackChannel = 'test-channel';
  process.env.SlackHookURL = 'http://test.hook.com';
  process.env.WeatherJSON = JSON.stringify(alert);

  const originalPost = weatherbot.post;
  weatherbot.post = message => {
    assert.equal(
      message.message,
      '*Flash Flood Warning* from Saturday (04/29) 7:51 AM until Saturday (04/29) 12:30 PM https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb\n*Flash Flood Watch* from Saturday (04/29) 3:29 AM until Sunday (04/30) 7:00 PM https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e\n'
    );
    assert.equal(message.icon, ':bangbang:');
    return new Promise(resolve => {
      resolve('success');
    });
  };

  weatherbot.weather({}, null, (err, res) => {
    assert.ifError(err, 'Should not error');
    assert.deepEqual(
      res,
      'success',
      'Success message from post() should appear in callback'
    );
    weatherbot.post = originalPost;
    assert.end();
  });
});

const snow = require('./fixtures/snow.json');
test('[weatherbot] success, park the cars good (snow)', assert => {
  process.env.SlackChannel = 'test-channel';
  process.env.SlackHookURL = 'http://test.hook.com';
  process.env.WeatherJSON = JSON.stringify(snow);

  const originalPost = weatherbot.post;
  weatherbot.post = message => {
    assert.equal(
      message.message,
      "We're expected to get *4.57 inches* of snow over the next 12 hours. Park the cars good!"
    );
    assert.equal(message.icon, ':snowflake:');
    return new Promise(resolve => {
      resolve('success');
    });
  };

  weatherbot.weather({}, null, (err, res) => {
    assert.ifError(err, 'Should not error');
    assert.deepEqual(
      res,
      'success',
      'Success message from post() should appear in callback'
    );
    weatherbot.post = originalPost;
    assert.end();
  });
});

const nothing = require('./fixtures/nothing.json');
test('[weatherbot] do nothing', assert => {
  process.env.SlackChannel = 'test-channel';
  process.env.SlackHookURL = 'http://test.hook.com';
  process.env.WeatherJSON = JSON.stringify(nothing);

  weatherbot.weather({}, null, (err, res) => {
    assert.ifError(err, 'Should not error');
    assert.deepEqual(
      res,
      "No snow expected, it's not that nice out, and there are no weather alerts.",
      'Message should appear in callback'
    );
    assert.end();
  });
});
