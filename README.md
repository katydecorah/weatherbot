# weatherbot [![Build Status](https://travis-ci.org/katydecorah/weatherbot.svg?branch=master)](https://travis-ci.org/katydecorah/weatherbot)

A Slack bot that posts a message if:

+ There will be snow (more than one inch of snow over the next twelve hours).
+ It's nice out (temperature is between 50/60℉ and 80℉ and low probability of precipitation).
* There are any weather alerts.

This bot uses Slack API and Dark Sky API. I can also be run automatically with Amazon Web Services (AWS).

Skycon | emoji
-------|-------
clear-day | ☀️
clear-night | 🌙
partly-cloudy-day | ⛅️
partly-cloudy-night | ⛅️
cloudy | ☁️
rain | 🌧
sleet | 🌨
snow | ❄️
wind | 🌬
fog | 🌫

## Set up

Create a [Dark Sky account](https://darksky.net/dev/) and set token as environment variable:

```
echo "export DarkSkySecretKey=0000ffff0000ffff0000ffff0000ffff0000ffff" >> ~/.bash_profile
```

Create a [Slack Webhook](https://api.slack.com/incoming-webhooks) and set the url as environment variable:

```
echo "export SlackHookURL=0000ffff0000ffff0000ffff0000ffff0000ffff" >> ~/.bash_profile
```

## Run manually

After you set up the environment, you can run WeatherBot from the command line.

First run: `npm install` and `npm link`.

And then you can run the command:

```
weatherbot --channel=<channel> --lat=<latitude> --long=<longitude>
```

Example: weatherbot --channel=@katydecorah --lat=43.0 --long=-73.8
