import getMessage from "../get-message";
import alert from "./fixtures/alert.json";
import success from "./fixtures/success.json";
import snow from "./fixtures/snow.json";
import nothing from "./fixtures/nothing.json";
import errored from "./fixtures/error.json";
import * as core from "@actions/core";

describe("getMessage", () => {
  jest.spyOn(core, "getInput").mockImplementation(() => "America/New_York");

  test("alert", () => {
    expect(getMessage(alert)).toMatchInlineSnapshot(`
      [
        {
          "text": {
            "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb|Flash Flood Warning>*
      Saturday 8:51 AM until 1:30 PM",
            "type": "mrkdwn",
          },
          "type": "section",
        },
        {
          "text": {
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
      [
        {
          "text": {
            "text": ":cloud: *It's 71℉!*",
            "type": "mrkdwn",
          },
          "type": "section",
        },
      ]
    `);
  });
  test("precipAccumulation is optional", () => {
    expect(getMessage(errored)).toMatchInlineSnapshot(`
      [
        {
          "text": {
            "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=NY1263E347E768.WinterStormWarning.1263E363C9B0NY.ALYWSWALY.f92fcbb051ad521ec09f3d653fca0d27|Winter Storm Warning>*
      Friday 1:00 AM until 10:00 PM",
            "type": "mrkdwn",
          },
          "type": "section",
        },
        {
          "type": "divider",
        },
        {
          "text": {
            "text": "*Foggy starting tonight, continuing until tomorrow afternoon.*
      The estimated snow accumulation is 6.0":

      :crescent_moon:   7 PM	0" 24℉
      :crescent_moon:   8 PM	0.0" 22℉
      :partly_sunny:   9 PM	0.0" 21℉
      :partly_sunny: 10 PM	0" 20℉
      :partly_sunny: 11 PM	0" 19℉
      :cloud: 12 AM	0.0" 19℉
      :cloud:   1 AM	0.0" 20℉
      :cloud:   2 AM	0.1" 20℉
      :cloud:   3 AM	0.3" 19℉
      :fog:   4 AM	0.8" 19℉
      :fog:   5 AM	1.2" 18℉
      :fog:   6 AM	1.5" 18℉
      :fog:   7 AM	2.0" 17℉",
            "type": "mrkdwn",
          },
          "type": "section",
        },
      ]
    `);
  });
  test("snow", () => {
    expect(getMessage(snow)).toMatchInlineSnapshot(`
      [
        {
          "text": {
            "text": ":bangbang: *<https://alerts.weather.gov/cap/wwacapget.php?x=CO12584B430174.WinterStormWarning.12584B528040CO.PUBWSWPUB.4699429342326a6b57f552fae35b1fa6|Winter Storm Warning>*
      Saturday 6:45 AM until Sunday 8:00 AM",
            "type": "mrkdwn",
          },
          "type": "section",
        },
        {
          "type": "divider",
        },
        {
          "text": {
            "text": "*Snow (4–7 in.) until tomorrow morning.*
      The estimated snow accumulation is 4.6":

      :snowflake: 12 PM	0.5" 26℉
      :snowflake:   1 PM	0.2" 27℉
      :snowflake:   2 PM	0.3" 28℉
      :snowflake:   3 PM	0.5" 29℉
      :snowflake:   4 PM	0.4" 30℉
      :snowflake:   5 PM	0.4" 30℉
      :snowflake:   6 PM	0.4" 30℉
      :snowflake:   7 PM	0.3" 29℉
      :snowflake:   8 PM	0.3" 28℉
      :snowflake:   9 PM	0.3" 27℉
      :snowflake: 10 PM	0.3" 27℉
      :snowflake: 11 PM	0.3" 26℉
      :snowflake: 12 AM	0.3" 25℉",
            "type": "mrkdwn",
          },
          "type": "section",
        },
      ]
    `);
  });
  test("nothing", () => {
    expect(getMessage(nothing)).toMatchInlineSnapshot(`[]`);
  });
});
