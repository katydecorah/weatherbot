import { Currently } from "./get-weather";
import getIcon from "./icons";

export default function checkItsNiceOut(current: Currently) {
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
