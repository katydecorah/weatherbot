# weatherbot

A GitHub action that posts weather announcements to Slack, if:

- There will be snow (more than one inch of snow over the next twelve hours).
- It's nice out (temperature is between 50/60℉ and 80℉ and low probability of precipitation).
- There are any weather warnings or watches.

This bot uses the Slack and Dark Sky APIs.

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
name: Weatherbot

on:
  schedule:
    - cron: "0 0,12,18 * * *"

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
          Latitude: ${{ secrets.Latitude }}
          Longitude: ${{ secrets.Longitude }}
          DarkSkySecretKey: ${{ secrets.DarkSkySecretKey }}
          SlackWebHookUrl: ${{ secrets.SlackWebHookUrl }}
```

## Action options

- `Latitude`: Required. The latitude of where you want to return the weather.

- `Longitude`: Required. The longitude of where you want to return the weather.

- `DarkSkySecretKey`: Required. Your Dark Sky secrety key. Use a respository secret https://docs.github.com/en/actions/security-guides/encrypted-secrets

- `SlackWebHookUrl`: Required. Your Slack webhook URL. Use a respository secret https://docs.github.com/en/actions/security-guides/encrypted-secrets

- `Timezone`: Your timezone. Default: `America/New_York`.

<!-- END GENERATED DOCUMENTATION -->
