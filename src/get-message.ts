import { Weather } from "./get-weather";
import getPrecipitation from "./precipitation";
import checkItsNiceOut from "./nice-out";
import getAlerts from "./alerts";

export default function getMessage({ hourly, currently, alerts }: Weather) {
  const precipitation = getPrecipitation(hourly);
  const niceOut = checkItsNiceOut(currently);
  const listAlerts = getAlerts(alerts);
  return [...precipitation, ...niceOut, ...listAlerts];
}
