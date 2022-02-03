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


<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
on: push

jobs:
  weather_update:
    runs-on: macOS-latest
    name: Weather
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Weather
        uses: katydecorah/weatherbot@v1.0.0
        with:
          Latitude: 43.0616993
          Longitude: -73.8069372
          DarkSkySecretKey: ${{ secrets.DarkSkySecretKey }}
          SlackChannel: "@katydecorah"
          SlackWebHookUrl: ${{ secrets.SlackWebHookUrl }}
```

## Action options

- `Latitude`: Required. The latitude of where you want to return the weather.

- `Longitude`: Required. The longitude of where you want to return the weather.

- `DarkSkySecretKey`: Required. undefined

- `SlackChannel`: Required. The Slack channel to post the weather status.

- `SlackWebHookUrl`: Required. Your Slack webhook URL. Use a respository secret https://docs.github.com/en/actions/security-guides/encrypted-secrets

<!-- END GENERATED DOCUMENTATION -->
