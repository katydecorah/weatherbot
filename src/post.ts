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
    await fetch(`${SlackWebHookUrl}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
  } catch (error) {
    throw new Error(error);
  }
}
