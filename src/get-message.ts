import { Weather } from "./get-weather";
import getPrecipitation from "./precipitation";
import checkItsNiceOut from "./nice-out";
import getAlerts from "./alerts";
import { IncomingWebhookSendArguments } from "@slack/webhook";

export default function getMessage({ hourly, currently, alerts }: Weather) {
  const listAlerts = getAlerts(alerts);
  const precipitation = getPrecipitation(hourly);
  const niceOut = checkItsNiceOut(currently);
  return [
    ...listAlerts,
    ...addDivider(listAlerts, precipitation, niceOut),
    ...precipitation,
    ...addDivider(niceOut, precipitation, listAlerts),
    ...niceOut,
  ];
}

function addDivider(arr1: Message, arr2: Message, arr3: Message) {
  return [
    ...(arr1.length && (arr2.length || arr3.length)
      ? [
          {
            type: "divider",
          },
        ]
      : []),
  ];
}

export type Message = [] | IncomingWebhookSendArguments["blocks"];
