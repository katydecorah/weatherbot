import { Alerts, Currently, Interval, Weather } from "./get-weather";

export default function getMessage({ hourly, currently, alerts }: Weather) {
  return [
    ...(getPrecipitation(hourly) ? [...getPrecipitation(hourly)] : []),
    ...(checkItsNiceOut(currently) ? [...checkItsNiceOut(currently)] : []),
    ...(getAlerts(alerts) ? [...getAlerts(alerts)] : []),
  ];
}

export function getPrecipitation(hourly: Interval) {
  const data = hourly.data.slice(0, 13);
  const precipitation = data.reduce((precipitation, hour) => {
    if (hour.precipType == "snow" && hour.precipAccumulation) {
      return precipitation + hour.precipAccumulation;
    } else {
      return precipitation;
    }
  }, 0);

  return precipitation > 1
    ? [
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `We're expected to get *${
                Math.ceil(precipitation * 100) / 100
              } inches* of snow over the next 12 hours.`,
            },
            {
              type: "mrkdwn",
              text: ":snowflake:",
            },
          ],
        },
      ]
    : [];
}

export function checkItsNiceOut(current: Currently) {
  const coolerMonths = [0, 1, 2, 3, 11];
  let itsNiceOut = false;
  const today = new Date();
  const month = today.getMonth();
  // Check if it's currently nice out
  if (current.temperature < 81 && current.precipProbability < 0.2) {
    if (coolerMonths.includes(month)) {
      // cooler months
      if (current.temperature >= 50) itsNiceOut = true;
    } else {
      // warmer months
      if (current.temperature >= 60) itsNiceOut = true;
    }
  }
  return itsNiceOut
    ? [
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `It's ${Math.round(current.temperature)}℉. Go outside!`,
            },
            {
              type: "mrkdwn",
              text: getIcon(current.icon),
            },
          ],
        },
      ]
    : [];
}

export function getAlerts(data: Alerts[]) {
  if (!data) return [];
  const alerts = data.filter((f) => f.severity !== "advisory");
  if (!alerts.length) return [];
  return getAlertDetails(alerts);
}

function formatTime(unix: number) {
  const dtFormat = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    dateStyle: "short",
    timeZone: "America/New_York",
  });
  return dtFormat.format(new Date(unix * 1e3));
}

export function getAlertDetails(alerts: Alerts[]) {
  return [
    {
      type: "section",
      fields: alerts.reduce(
        (arr, alert) => [
          ...arr,
          {
            type: "mrkdwn",
            text: `*<${alert.uri}|${alert.title}>*\n${formatTime(
              alert.time
            )} until ${formatTime(alert.expires)}`,
          },
          {
            type: "mrkdwn",
            text: getIcon(alert.severity),
          },
        ],
        []
      ),
    },
  ];
}

export function getIcon(icon_emoji: string) {
  const icons = {
    "clear-day": ":sunny:",
    "clear-night": ":crescent_moon:",
    "partly-cloudy-day": ":partly_sunny:",
    "partly-cloudy-night": ":partly_sunny:",
    cloudy: ":cloud:",
    rain: ":rain_cloud:",
    sleet: ":snow_cloud:",
    snow: ":snowflake:",
    wind: ":wind_blowing_face:",
    fog: ":fog:",
    warning: ":bangbang:",
    watch: ":exclamation:",
    advisory: ":warning:",
  };
  return icons[icon_emoji];
}
