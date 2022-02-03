# weatherbot

A Slack bot that posts a message if:

- There will be snow (more than one inch of snow over the next twelve hours).
- It's nice out (temperature is between 50/60℉ and 80℉ and low probability of precipitation).
- There are any weather alerts.

This bot uses Slack API and Dark Sky API.

| Skycon              | emoji |
| ------------------- | ----- |
| clear-day           | ☀️    |
| clear-night         | 🌙    |
| partly-cloudy-day   | ⛅️   |
| partly-cloudy-night | ⛅️   |
| cloudy              | ☁️    |
| rain                | 🌧     |
| sleet               | 🌨     |
| snow                | ❄️    |
| wind                | 🌬     |
| fog                 | 🌫     |
