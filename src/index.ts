"use strict";

import { setFailed } from "@actions/core";
import getWeather from "./get-weather.js";
import getMessage from "./get-message.js";
import post from "./post.js";

async function weather() {
  try {
    const currentWeather = await getWeather();
    const message = getMessage(currentWeather);
    if (message) await post(message);
  } catch (error) {
    setFailed(error.message);
  }
}

export default weather();
