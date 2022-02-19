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
  const text = blocks
    .map((block) => ("text" in block ? formatText(block.text.text) : ""))
    .join("\n");
  try {
    const SlackWebHookUrl = getInput("SlackWebHookUrl");
    const webhook = new IncomingWebhook(SlackWebHookUrl);
    await webhook.send({ text, blocks });
  } catch (error) {
    throw new Error(error);
  }
}
