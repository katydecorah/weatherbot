import { Weather } from "./get-weather";
import getPrecipitation from "./precipitation";
import checkItsNiceOut from "./nice-out";
import getAlerts from "./alerts";
import { IncomingWebhookSendArguments } from "@slack/webhook";

export default function getMessage({ hourly, currently, alerts }: Weather) {
  const listAlerts = getAlerts(alerts);
  const precipitation = getPrecipitation(hourly);
  const niceOut = checkItsNiceOut(currently);
  return [...listAlerts, ...precipitation, ...niceOut];
}

export type Message = [] | IncomingWebhookSendArguments["blocks"];
