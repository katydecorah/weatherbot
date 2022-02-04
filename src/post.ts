import { IncomingWebhook } from "@slack/webhook";
import { getInput } from "@actions/core";

export default async function post({
  icon_emoji,
  text,
}: {
  icon_emoji: string;
  text: string;
}) {
  if (!text)
    return "No snow expected, it's not that nice out, and there are no weather alerts.";
  try {
    const SlackWebHookUrl = getInput("SlackWebHookUrl");
    const webhook = new IncomingWebhook(SlackWebHookUrl);
    await webhook.send({ text, icon_emoji });
  } catch (error) {
    throw new Error(error);
  }
}
