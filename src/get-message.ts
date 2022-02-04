import { Alerts, Currently, Interval, Weather } from "./get-weather";
import { getInput } from "@actions/core";

export default function getMessage({ hourly, currently, alerts }: Weather) {
  return [
    ...(getPrecipitation(hourly) ? [...getPrecipitation(hourly)] : []),
    ...(checkItsNiceOut(currently) ? [...checkItsNiceOut(currently)] : []),
    ...(getAlerts(alerts) ? [...getAlerts(alerts)] : []),
  ];
}

function unixToHour(unix: number) {
  const hourFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: getInput("Timezone"),
  });
  return hourFormat.format(new Date(unix * 1e3));
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
  if (precipitation < 1) return [];
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:snowflake: *${hourly.summary}*
The estimated snow accumulation is ${precipitation.toFixed(1)}":

${data
  .map(
    (hour) =>
      `${unixToHour(hour.time)}\t${hour.precipAccumulation.toFixed(
        1
      )}" ${hour.temperature.toFixed(0)}℉`
  )
  .join("\n")}`,
      },
    },
  ];
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
  if (!itsNiceOut) return [];
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${getIcon(current.icon)} **It's ${Math.round(
          current.temperature
        )}℉**
Go outside!`,
      },
    },
  ];
}

function formatTime(unix: number, next = "") {
  const messageFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    timeZone: getInput("Timezone"),
  });

  const dayFormat = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: getInput("Timezone"),
  });
  const day = dayFormat.format(new Date(unix * 1e3));
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: getInput("Timezone"),
  });
  return {
    message:
      next === day
        ? timeFormat.format(new Date(unix * 1e3))
        : messageFormat.format(new Date(unix * 1e3)),
    day,
  };
}

function eventRange(start: number, end: number) {
  return {
    start: formatTime(start).message,
    end: formatTime(end, formatTime(start).day).message,
  };
}

export function getAlerts(alerts: Alerts[]) {
  if (!alerts) return [];
  const filtered = alerts.filter((f) => f.severity !== "advisory");
  if (filtered.length === 0) return [];
  return filtered.reduce((arr, alert) => {
    const { start, end } = eventRange(alert.time, alert.expires);
    return [
      ...arr,
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${getIcon(alert.severity)} *<${alert.uri}|${
            alert.title
          }>*\n${start} until ${end}`,
        },
      },
    ];
  }, []);
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
