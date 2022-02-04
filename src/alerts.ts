import { Alerts } from "./get-weather";
import getIcon from "./icons";
import { getInput } from "@actions/core";

export default function getAlerts(alerts: Alerts[]) {
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
