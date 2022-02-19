import post from "../post";
import { IncomingWebhook } from "@slack/webhook";
import { info } from "@actions/core";
import getMessage from "../get-message";

import snow from "./fixtures/snow.json";
import alert from "./fixtures/alert.json";
import success from "./fixtures/success.json";

jest.mock("@slack/webhook");

jest.mock("@actions/core", () => {
  return {
    getInput: jest.fn().mockImplementation((value) => {
      if (value === "Timezone") return "America/New_York";
      if (value === "SlackWebHookUrl") return "https://my-webhook.gov";
    }),
    info: jest.fn(),
  };
});

describe("post", () => {
  test("no weather", async () => {
    await post();
    expect(info).toHaveBeenCalledWith(
      "No snow expected, it's not that nice out, and there are no weather alerts."
    );
  });
  test("no weather, empty array", async () => {
    await post([]);
    expect(info).toHaveBeenCalledWith(
      "No snow expected, it's not that nice out, and there are no weather alerts."
    );
  });
  test("success", async () => {
    await post(getMessage(success));
    const sendSpy = jest
      .spyOn(IncomingWebhook.prototype, "send")
      .mockImplementation();
    expect(info).not.toHaveBeenCalledWith();
    expect(IncomingWebhook).toHaveBeenCalledWith("https://my-webhook.gov");
    expect(sendSpy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "blocks": Array [
            Object {
              "text": Object {
                "text": ":cloud: **It's 71℉**
      Go outside!",
                "type": "mrkdwn",
              },
              "type": "section",
            },
          ],
          "text": ":cloud: **It's 71℉**
      Go outside!",
        },
      ]
    `);
    sendSpy.mockRestore();
  });
  test("alert", async () => {
    await post(getMessage(alert));
    const sendSpy = jest
      .spyOn(IncomingWebhook.prototype, "send")
      .mockImplementation();
    expect(info).not.toHaveBeenCalledWith();
    expect(IncomingWebhook).toHaveBeenCalledWith("https://my-webhook.gov");
    expect(sendSpy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "blocks": Array [
            Object {
              "text": Object {
                "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb|Flash Flood Warning>*
      Saturday 8:51 AM until 1:30 PM",
                "type": "mrkdwn",
              },
              "type": "section",
            },
            Object {
              "text": Object {
                "text": ":exclamation: *<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e|Flash Flood Watch>*
      Saturday 4:29 AM until Sunday 8:00 PM",
                "type": "mrkdwn",
              },
              "type": "section",
            },
          ],
          "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb|Flash Flood Warning>*
      Saturday 8:51 AM until 1:30 PM :exclamation: *<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e|Flash Flood Watch>*
      Saturday 4:29 AM until Sunday 8:00 PM",
        },
      ]
    `);
    sendSpy.mockRestore();
  });
  test("snow", async () => {
    await post(getMessage(snow));
    const sendSpy = jest
      .spyOn(IncomingWebhook.prototype, "send")
      .mockImplementation();
    expect(info).not.toHaveBeenCalledWith();
    expect(IncomingWebhook).toHaveBeenCalledWith("https://my-webhook.gov");
    expect(sendSpy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "blocks": Array [
            Object {
              "text": Object {
                "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=CO12584B430174.WinterStormWarning.12584B528040CO.PUBWSWPUB.4699429342326a6b57f552fae35b1fa6|Winter Storm Warning>*
      Saturday 6:45 AM until Sunday 8:00 AM",
                "type": "mrkdwn",
              },
              "type": "section",
            },
            Object {
              "type": "divider",
            },
            Object {
              "text": Object {
                "text": "*Snow (4–7 in.) until tomorrow morning.*
      The estimated snow accumulation is 4.6\\":

      :snowflake: 12 PM	0.5\\" 26℉
      :snowflake:   1 PM	0.2\\" 27℉
      :snowflake:   2 PM	0.3\\" 28℉
      :snowflake:   3 PM	0.5\\" 29℉
      :snowflake:   4 PM	0.4\\" 30℉
      :snowflake:   5 PM	0.4\\" 30℉
      :snowflake:   6 PM	0.4\\" 30℉
      :snowflake:   7 PM	0.3\\" 29℉
      :snowflake:   8 PM	0.3\\" 28℉
      :snowflake:   9 PM	0.3\\" 27℉
      :snowflake: 10 PM	0.3\\" 27℉
      :snowflake: 11 PM	0.3\\" 26℉
      :snowflake: 12 AM	0.3\\" 25℉",
                "type": "mrkdwn",
              },
              "type": "section",
            },
          ],
          "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=CO12584B430174.WinterStormWarning.12584B528040CO.PUBWSWPUB.4699429342326a6b57f552fae35b1fa6|Winter Storm Warning>*
      Saturday 6:45 AM until Sunday 8:00 AM  *Snow (4–7 in.) until tomorrow morning.*
      The estimated snow accumulation is 4.6\\":

      :snowflake: 12 PM	0.5\\" 26℉
      :snowflake:   1 PM	0.2\\" 27℉
      :snowflake:   2 PM	0.3\\" 28℉
      :snowflake:   3 PM	0.5\\" 29℉
      :snowflake:   4 PM	0.4\\" 30℉
      :snowflake:   5 PM	0.4\\" 30℉
      :snowflake:   6 PM	0.4\\" 30℉
      :snowflake:   7 PM	0.3\\" 29℉
      :snowflake:   8 PM	0.3\\" 28℉
      :snowflake:   9 PM	0.3\\" 27℉
      :snowflake: 10 PM	0.3\\" 27℉
      :snowflake: 11 PM	0.3\\" 26℉
      :snowflake: 12 AM	0.3\\" 25℉",
        },
      ]
    `);
    sendSpy.mockRestore();
  });
});
