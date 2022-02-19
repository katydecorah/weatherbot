import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";
import { getInput, info } from "@actions/core";

export default async function post(
  blocks: IncomingWebhookSendArguments["blocks"]
) {
  /*if (!blocks || blocks.length === 0) {
    info(
      "No snow expected, it's not that nice out, and there are no weather alerts."
    );
    return;
  }*/
  try {
    const SlackWebHookUrl = getInput("SlackWebHookUrl");
    const webhook = new IncomingWebhook(SlackWebHookUrl);
    await webhook.send({
      text: "testing 1234",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `This is a block`,
          },
        },
      ],
    });
  } catch (error) {
    throw new Error(error);
  }
}
