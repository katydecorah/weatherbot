import { Currently } from "./get-weather";
import getIcon from "./icons";
import { Message } from "./get-message";

export default function checkItsNiceOut(current: Currently): Message {
  const itsNiceOut = calibrateNiceness(current);
  if (!itsNiceOut) return [];
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${getIcon(current.icon)} *It's ${Math.round(
          current.temperature
        )}℉!*`,
      },
    },
  ];
}

function calibrateNiceness({ temperature, precipProbability }: Currently) {
  if (temperature > 81 || precipProbability > 0.2) return false;
  if (temperature >= 50) return true;
  return false;
}
