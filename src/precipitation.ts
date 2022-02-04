import { Interval, Datum } from "./get-weather";
import { getInput } from "@actions/core";

function unixToHour(unix: number) {
  const hourFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: getInput("Timezone"),
  });
  return hourFormat.format(new Date(unix * 1e3));
}

export function listHourly({ time, precipAccumulation, temperature }: Datum) {
  return `${unixToHour(time)}\t${precipAccumulation.toFixed(
    1
  )}" ${temperature.toFixed(0)}℉`;
}

export default function getPrecipitation(hourly: Interval) {
  const data = hourly.data.slice(0, 13);
  const precipitation = data.reduce(
    (total, { precipType, precipAccumulation }) =>
      precipType == "snow" && precipAccumulation
        ? total + precipAccumulation
        : total,
    0
  );
  if (precipitation < 1) return [];
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:snowflake: *${hourly.summary}*
The estimated snow accumulation is ${precipitation.toFixed(1)}":

${data.map(listHourly).join("\n")}`,
      },
    },
  ];
}
