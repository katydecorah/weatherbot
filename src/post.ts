import fetch from "node-fetch";
import { getInput } from "@actions/core";

export default async function post({
  icon_emoji,
  text,
}: {
  icon_emoji: string;
  text: string;
}) {
  const json = {
    channel: getInput("SlackChannel"),
    username: "WeatherBot",
    icon_emoji,
    parse: "full",
    text,
    markdown: true,
  };

  const SlackWebHookUrl = getInput("SlackWebHookUrl");

  if (!text)
    return "No snow expected, it's not that nice out, and there are no weather alerts.";
  try {
    const response = await fetch(`${SlackWebHookUrl}`, {
      method: "POST",
      ...json,
    });
    const data = (await response.json()) as { statusCode: number };
    if (data.statusCode == 200) return "Posted to Slack";
    else throw new Error(`${data}`);
  } catch (error) {
    throw new Error(error);
  }
}
