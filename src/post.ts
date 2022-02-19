import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";
import { getInput, info } from "@actions/core";

function formatText(text: string) {
  const stripText = text.split("\n")[0].replace(/\*/g, "");
  const removeLinks = stripText.match(/<.*\|(.*)>/);
  return removeLinks
    ? stripText.replace(removeLinks[0], removeLinks[1])
    : stripText;
}

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
    "text" in block ? formatText(block.text.text) : ""
  );
  try {
    const SlackWebHookUrl = getInput("SlackWebHookUrl");
    const webhook = new IncomingWebhook(SlackWebHookUrl);
    await webhook.send({ text: summary.join("\n"), blocks });
  } catch (error) {
    throw new Error(error);
  }
}
