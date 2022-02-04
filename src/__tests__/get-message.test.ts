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
      Saturday 8:51 AM until 1:30 PM",
              "type": "mrkdwn",
            },
            Object {
              "text": ":bangbang:",
              "type": "mrkdwn",
            },
            Object {
              "text": "*<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e|Flash Flood Watch>*
      Saturday 4:29 AM until Sunday 8:00 PM",
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
              "text": "*Snow (4–7 in.) until tomorrow morning.*

      12 PM	0.5'
      1 PM	0.2'
      2 PM	0.3'
      3 PM	0.5'
      4 PM	0.4'
      5 PM	0.4'
      6 PM	0.4'
      7 PM	0.3'
      8 PM	0.3'
      9 PM	0.3'
      10 PM	0.3'
      11 PM	0.3'
      12 AM	0.3'",
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
      Saturday 6:45 AM until Sunday 8:00 AM",
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
