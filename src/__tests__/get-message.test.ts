import getMessage from "../get-message";
import alert from "./fixtures/alert.json";
import success from "./fixtures/success.json";
import snow from "./fixtures/snow.json";
import nothing from "./fixtures/nothing.json";
import * as core from "@actions/core";

describe("getMessage", () => {
  jest.spyOn(core, "getInput").mockImplementation(() => "America/New_York");

  test("alert", () => {
    expect(getMessage(alert)).toMatchInlineSnapshot(`
      Array [
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
      ]
    `);
  });
  test("success", () => {
    expect(getMessage(success)).toMatchInlineSnapshot(`
      Array [
        Object {
          "text": Object {
            "text": ":cloud: **It's 71℉**
      Go outside!",
            "type": "mrkdwn",
          },
          "type": "section",
        },
      ]
    `);
  });
  test("snow", () => {
    expect(getMessage(snow)).toMatchInlineSnapshot(`
      Array [
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
      :snowflake: &nbsp;1 PM	0.2\\" 27℉
      :snowflake: &nbsp;2 PM	0.3\\" 28℉
      :snowflake: &nbsp;3 PM	0.5\\" 29℉
      :snowflake: &nbsp;4 PM	0.4\\" 30℉
      :snowflake: &nbsp;5 PM	0.4\\" 30℉
      :snowflake: &nbsp;6 PM	0.4\\" 30℉
      :snowflake: &nbsp;7 PM	0.3\\" 29℉
      :snowflake: &nbsp;8 PM	0.3\\" 28℉
      :snowflake: &nbsp;9 PM	0.3\\" 27℉
      :snowflake: 10 PM	0.3\\" 27℉
      :snowflake: 11 PM	0.3\\" 26℉
      :snowflake: 12 AM	0.3\\" 25℉",
            "type": "mrkdwn",
          },
          "type": "section",
        },
      ]
    `);
  });
  test("nothing", () => {
    expect(getMessage(nothing)).toMatchInlineSnapshot(`Array []`);
  });
});
