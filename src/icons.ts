export default function getIcon(icon_emoji: string) {
  const icons = {
    "clear-day": ":sunny:",
    "clear-night": ":crescent_moon:",
    "partly-cloudy-day": ":partly_sunny:",
    "partly-cloudy-night": ":partly_sunny:",
    cloudy: ":cloud:",
    rain: ":rain_cloud:",
    sleet: ":snow_cloud:",
    snow: ":snowflake:",
    wind: ":wind_blowing_face:",
    fog: ":fog:",
    warning: ":bangbang:",
    watch: ":exclamation:",
    advisory: ":warning:",
  };
  return icons[icon_emoji];
}
