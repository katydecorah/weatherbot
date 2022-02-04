import getMessage from "../get-message";

import alert from "./fixtures/alert.json";
import success from "./fixtures/success.json";
import snow from "./fixtures/snow.json";
import nothing from "./fixtures/nothing.json";

describe("getMessage", () => {
  test("alert", () => {
    expect(getMessage(alert)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fields": Array [
            Object {
              "text": "*<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb|Flash Flood Warning>*
      4/29/17, 8:51 AM until 4/29/17, 1:30 PM",
              "type": "mrkdwn",
            },
            Object {
              "text": ":bangbang:",
              "type": "mrkdwn",
            },
            Object {
              "text": "*<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e|Flash Flood Watch>*
      4/29/17, 4:29 AM until 4/30/17, 8:00 PM",
              "type": "mrkdwn",
            },
            Object {
              "text": ":exclamation:",
              "type": "mrkdwn",
            },
          ],
          "type": "section",
        },
      ]
    `);
  });
  test("success", () => {
    expect(getMessage(success)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fields": Array [
            Object {
              "text": "It's 71℉. Go outside!",
              "type": "mrkdwn",
            },
            Object {
              "text": ":cloud:",
              "type": "mrkdwn",
            },
          ],
          "type": "section",
        },
      ]
    `);
  });
  test("snow", () => {
    expect(getMessage(snow)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fields": Array [
            Object {
              "text": "We're expected to get *4.57 inches* of snow over the next 12 hours.",
              "type": "mrkdwn",
            },
            Object {
              "text": ":snowflake:",
              "type": "mrkdwn",
            },
          ],
          "type": "section",
        },
        Object {
          "fields": Array [
            Object {
              "text": "*<https://alerts.weather.gov/cap/wwacapget.php?x=CO12584B430174.WinterStormWarning.12584B528040CO.PUBWSWPUB.4699429342326a6b57f552fae35b1fa6|Winter Storm Warning>*
      4/29/17, 6:45 AM until 4/30/17, 8:00 AM",
              "type": "mrkdwn",
            },
            Object {
              "text": ":bangbang:",
              "type": "mrkdwn",
            },
          ],
          "type": "section",
        },
      ]
    `);
  });
  test("nothing", () => {
    expect(getMessage(nothing)).toMatchInlineSnapshot(`Array []`);
  });
});
