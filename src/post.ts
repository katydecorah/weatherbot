import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";
import { getInput, info } from "@actions/core";

export default async function post(
  blocks?: IncomingWebhookSendArguments["blocks"]
) {
  if (!blocks || blocks.length === 0) {
    info(
      "No snow expected, it's not that nice out, and there are no weather alerts."
    );
    return;
  }
  const summary = blocks.map((block) =>
    "text" in block ? block.text.text : ""
  );
  try {
    const SlackWebHookUrl = getInput("SlackWebHookUrl");
    const webhook = new IncomingWebhook(SlackWebHookUrl);
    await webhook.send({ text: summary.join(" "), blocks });
  } catch (error) {
    throw new Error(error);
  }
}
