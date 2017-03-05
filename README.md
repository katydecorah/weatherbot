# Weather Bot

A Slack bot that posts a message if:

+ There will be snow (more than one inch of snow over the next twelve hours).
+ It's nice out (temperature is between 50℉ and 90℉ and low probability of precipitation).
* There are any weather alerts.

This bot uses Slack API, Dark Sky API, and Amazon Web Services.

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