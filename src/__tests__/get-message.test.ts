import getMessage from "../get-message";

import alert from "./fixtures/alert.json";
import success from "./fixtures/success.json";
import snow from "./fixtures/snow.json";
import nothing from "./fixtures/nothing.json";

describe("getMessage", () => {
  test("alert", () => {
    expect(getMessage(alert)).toMatchInlineSnapshot(`
      Object {
        "icon_emoji": ":bangbang:",
        "text": "*Flash Flood Warning* from 4/29/17, 8:51 AM until 4/29/17, 1:30 PM https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B4351EC.FlashFloodWarning.12584B440D08MO.SGFFFSSGF.871ed93fdad70eafa96a72b70c339adb
      *Flash Flood Watch* from 4/29/17, 4:29 AM until 4/30/17, 8:00 PM https://alerts.weather.gov/cap/wwacapget.php?x=MO12584B42AD14.FlashFloodWatch.12584F8C0B40MO.SGFFFASGF.baa9e79367797852476837c777d55f8e
      ",
      }
    `);
  });
  test("success", () => {
    expect(getMessage(success)).toMatchInlineSnapshot(`
      Object {
        "icon_emoji": ":cloud:",
        "text": "It's 71℉. Go outside!",
      }
    `);
  });
  test("snow", () => {
    expect(getMessage(snow)).toMatchInlineSnapshot(`
      Object {
        "icon_emoji": ":snowflake:",
        "text": "We're expected to get *4.57 inches* of snow over the next 12 hours. Park the cars good!",
      }
    `);
  });
  test("nothing", () => {
    expect(getMessage(nothing)).toBeUndefined();
  });
});
